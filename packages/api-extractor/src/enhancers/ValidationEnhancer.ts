// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'node:path';
import { ReleaseTag, releaseTagCompare, releaseTagGetTagName } from '@discordjs/api-extractor-model';
import * as ts from 'typescript';
import type { AstDeclaration } from '../analyzer/AstDeclaration.js';
import type { AstEntity } from '../analyzer/AstEntity.js';
import type { AstModuleExportInfo } from '../analyzer/AstModule.js';
import { AstNamespaceImport } from '../analyzer/AstNamespaceImport.js';
import { AstSymbol } from '../analyzer/AstSymbol.js';
import { ExtractorMessageId } from '../api/ExtractorMessageId.js';
import type { ApiItemMetadata } from '../collector/ApiItemMetadata.js';
import type { Collector } from '../collector/Collector.js';
import type { CollectorEntity } from '../collector/CollectorEntity.js';
import type { SymbolMetadata } from '../collector/SymbolMetadata.js';

export class ValidationEnhancer {
	public static analyze(collector: Collector): void {
		const alreadyWarnedEntities: Set<AstEntity> = new Set<AstEntity>();

		for (const entity of collector.entities) {
			if (
				!(
					entity.consumable ||
					collector.extractorConfig.apiReportIncludeForgottenExports ||
					collector.extractorConfig.docModelIncludeForgottenExports
				)
			) {
				continue;
			}

			if (entity.astEntity instanceof AstSymbol) {
				// A regular exported AstSymbol

				const astSymbol: AstSymbol = entity.astEntity;

				astSymbol.forEachDeclarationRecursive((astDeclaration: AstDeclaration) => {
					ValidationEnhancer._checkReferences(collector, astDeclaration, alreadyWarnedEntities);
				});

				const symbolMetadata: SymbolMetadata = collector.fetchSymbolMetadata(astSymbol);
				ValidationEnhancer._checkForInternalUnderscore(collector, entity, astSymbol, symbolMetadata);
				ValidationEnhancer._checkForInconsistentReleaseTags(collector, astSymbol, symbolMetadata);
			} else if (entity.astEntity instanceof AstNamespaceImport) {
				// A namespace created using "import * as ___ from ___"
				const astNamespaceImport: AstNamespaceImport = entity.astEntity;

				const astModuleExportInfo: AstModuleExportInfo = astNamespaceImport.fetchAstModuleExportInfo(collector);

				for (const namespaceMemberAstEntity of astModuleExportInfo.exportedLocalEntities.values()) {
					if (namespaceMemberAstEntity instanceof AstSymbol) {
						const astSymbol: AstSymbol = namespaceMemberAstEntity;

						astSymbol.forEachDeclarationRecursive((astDeclaration: AstDeclaration) => {
							ValidationEnhancer._checkReferences(collector, astDeclaration, alreadyWarnedEntities);
						});

						const symbolMetadata: SymbolMetadata = collector.fetchSymbolMetadata(astSymbol);

						// (Don't apply ValidationEnhancer._checkForInternalUnderscore() for AstNamespaceImport members)

						ValidationEnhancer._checkForInconsistentReleaseTags(collector, astSymbol, symbolMetadata);
					}
				}
			}
		}
	}

	private static _checkForInternalUnderscore(
		collector: Collector,
		collectorEntity: CollectorEntity,
		astSymbol: AstSymbol,
		symbolMetadata: SymbolMetadata,
	): void {
		let needsUnderscore = false;

		if (symbolMetadata.maxEffectiveReleaseTag === ReleaseTag.Internal) {
			if (astSymbol.parentAstSymbol) {
				// If it's marked as @internal and the parent isn't obviously already @internal, then it needs an underscore.
				//
				// For example, we WOULD need an underscore for a merged declaration like this:
				//
				//   /** @internal */
				//   export namespace X {
				//     export interface _Y { }
				//   }
				//
				//   /** @public */
				//   export class X {
				//     /** @internal */
				//     public static _Y(): void { }   // <==== different from parent
				//   }
				const parentSymbolMetadata: SymbolMetadata = collector.fetchSymbolMetadata(astSymbol);
				if (parentSymbolMetadata.maxEffectiveReleaseTag > ReleaseTag.Internal) {
					needsUnderscore = true;
				}
			} else {
				// If it's marked as @internal and has no parent, then it needs an underscore.
				// We use maxEffectiveReleaseTag because a merged declaration would NOT need an underscore in a case like this:
				//
				//   /** @public */
				//   export enum X { }
				//
				//   /** @internal */
				//   export namespace X { }
				//
				// (The above normally reports an error "ae-different-release-tags", but that may be suppressed.)
				needsUnderscore = true;
			}
		}

		if (needsUnderscore) {
			for (const exportName of collectorEntity.exportNames) {
				if (!exportName.startsWith('_')) {
					collector.messageRouter.addAnalyzerIssue(
						ExtractorMessageId.InternalMissingUnderscore,
						`The name "${exportName}" should be prefixed with an underscore` +
							` because the declaration is marked as @internal`,
						astSymbol,
						{ exportName },
					);
				}
			}
		}
	}

	private static _checkForInconsistentReleaseTags(
		collector: Collector,
		astSymbol: AstSymbol,
		symbolMetadata: SymbolMetadata,
	): void {
		if (astSymbol.isExternal) {
			// For now, don't report errors for external code.  If the developer cares about it, they should run
			// API Extractor separately on the external project
			return;
		}

		// Normally we will expect all release tags to be the same.  Arbitrarily we choose the maxEffectiveReleaseTag
		// as the thing they should all match.
		const expectedEffectiveReleaseTag: ReleaseTag = symbolMetadata.maxEffectiveReleaseTag;

		// This is set to true if we find a declaration whose release tag is different from expectedEffectiveReleaseTag
		let mixedReleaseTags = false;

		// This is set to false if we find a declaration that is not a function/method overload
		let onlyFunctionOverloads = true;

		// This is set to true if we find a declaration that is @internal
		let anyInternalReleaseTags = false;

		for (const astDeclaration of astSymbol.astDeclarations) {
			const apiItemMetadata: ApiItemMetadata = collector.fetchApiItemMetadata(astDeclaration);
			const effectiveReleaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;

			switch (astDeclaration.declaration.kind) {
				case ts.SyntaxKind.FunctionDeclaration:
				case ts.SyntaxKind.MethodDeclaration:
					break;
				default:
					onlyFunctionOverloads = false;
			}

			if (effectiveReleaseTag !== expectedEffectiveReleaseTag) {
				mixedReleaseTags = true;
			}

			if (effectiveReleaseTag === ReleaseTag.Internal) {
				anyInternalReleaseTags = true;
			}
		}

		if (mixedReleaseTags) {
			if (!onlyFunctionOverloads) {
				collector.messageRouter.addAnalyzerIssue(
					ExtractorMessageId.DifferentReleaseTags,
					'This symbol has another declaration with a different release tag',
					astSymbol,
				);
			}

			if (anyInternalReleaseTags) {
				collector.messageRouter.addAnalyzerIssue(
					ExtractorMessageId.InternalMixedReleaseTag,
					`Mixed release tags are not allowed for "${astSymbol.localName}" because one of its declarations` +
						` is marked as @internal`,
					astSymbol,
				);
			}
		}
	}

	private static _checkReferences(
		collector: Collector,
		astDeclaration: AstDeclaration,
		alreadyWarnedEntities: Set<AstEntity>,
	): void {
		const apiItemMetadata: ApiItemMetadata = collector.fetchApiItemMetadata(astDeclaration);
		const declarationReleaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;

		for (const referencedEntity of astDeclaration.referencedAstEntities) {
			let collectorEntity: CollectorEntity | undefined;
			let referencedReleaseTag: ReleaseTag;
			let localName: string;

			if (referencedEntity instanceof AstSymbol) {
				// If this is e.g. a member of a namespace, then we need to be checking the top-level scope to see
				// whether it's exported.
				//
				// Technically we should also check each of the nested scopes along the way.
				const rootSymbol: AstSymbol = referencedEntity.rootAstSymbol;

				if (rootSymbol.isExternal) {
					continue;
				}

				collectorEntity = collector.tryGetCollectorEntity(rootSymbol);
				localName = collectorEntity?.nameForEmit ?? rootSymbol.localName;

				const referencedMetadata: SymbolMetadata = collector.fetchSymbolMetadata(referencedEntity);
				referencedReleaseTag = referencedMetadata.maxEffectiveReleaseTag;
			} else if (referencedEntity instanceof AstNamespaceImport) {
				collectorEntity = collector.tryGetCollectorEntity(referencedEntity);

				referencedReleaseTag = ReleaseTag.Public;

				localName = collectorEntity?.nameForEmit ?? referencedEntity.localName;
			} else {
				continue;
			}

			if (collectorEntity?.consumable) {
				if (releaseTagCompare(declarationReleaseTag, referencedReleaseTag) > 0) {
					collector.messageRouter.addAnalyzerIssue(
						ExtractorMessageId.IncompatibleReleaseTags,
						`The symbol "${astDeclaration.astSymbol.localName}"` +
							` is marked as ${releaseTagGetTagName(declarationReleaseTag)},` +
							` but its signature references "${localName}"` +
							` which is marked as ${releaseTagGetTagName(referencedReleaseTag)}`,
						astDeclaration,
					);
				}
			} else {
				const entryPointFilename: string = path.basename(collector.workingPackage.entryPointSourceFile.fileName);

				if (!alreadyWarnedEntities.has(referencedEntity)) {
					alreadyWarnedEntities.add(referencedEntity);

					if (referencedEntity instanceof AstSymbol && ValidationEnhancer._isEcmaScriptSymbol(referencedEntity)) {
						// The main usage scenario for ECMAScript symbols is to attach private data to a JavaScript object,
						// so as a special case, we do NOT report them as forgotten exports.
					} else {
						collector.messageRouter.addAnalyzerIssue(
							ExtractorMessageId.ForgottenExport,
							`The symbol "${localName}" needs to be exported by the entry point ${entryPointFilename}`,
							astDeclaration,
						);
					}
				}
			}
		}
	}

	// Detect an AstSymbol that refers to an ECMAScript symbol declaration such as:
	//
	// const mySymbol: unique symbol = Symbol('mySymbol');
	private static _isEcmaScriptSymbol(astSymbol: AstSymbol): boolean {
		if (astSymbol.astDeclarations.length !== 1) {
			return false;
		}

		// We are matching a form like this:
		//
		// - VariableDeclaration:
		//   - Identifier:  pre=[mySymbol]
		//   - ColonToken:  pre=[:] sep=[ ]
		//   - TypeOperator:
		//     - UniqueKeyword:  pre=[unique] sep=[ ]
		//     - SymbolKeyword:  pre=[symbol]
		const astDeclaration: AstDeclaration = astSymbol.astDeclarations[0]!;
		if (ts.isVariableDeclaration(astDeclaration.declaration)) {
			const variableTypeNode: ts.TypeNode | undefined = astDeclaration.declaration.type;
			if (variableTypeNode) {
				for (const token of variableTypeNode.getChildren()) {
					if (token.kind === ts.SyntaxKind.SymbolKeyword) {
						return true;
					}
				}
			}
		}

		return false;
	}
}
