// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as tsdoc from '@microsoft/tsdoc';
import * as ts from 'typescript';
import type { Collector } from '../collector/Collector.js';
import type { DeclarationMetadata } from '../collector/DeclarationMetadata.js';
import type { WorkingPackage } from '../collector/WorkingPackage.js';
import type { AstDeclaration } from './AstDeclaration.js';
import type { AstEntity } from './AstEntity.js';
import type { AstModule } from './AstModule.js';
import { AstSymbol } from './AstSymbol.js';
import type { AstSymbolTable } from './AstSymbolTable.js';

/**
 * Used by `AstReferenceResolver` to report a failed resolution.
 *
 * @privateRemarks
 * This class is similar to an `Error` object, but the intent of `ResolverFailure` is to describe
 * why a reference could not be resolved.  This information could be used to throw an actual `Error` object,
 * but normally it is handed off to the `MessageRouter` instead.
 */
export class ResolverFailure {
	/**
	 * Details about why the failure occurred.
	 */
	public readonly reason: string;

	public constructor(reason: string) {
		this.reason = reason;
	}
}

/**
 * This resolves a TSDoc declaration reference by walking the `AstSymbolTable` compiler state.
 *
 * @remarks
 *
 * This class is analogous to `ModelReferenceResolver` from the `@microsoft/api-extractor-model` project,
 * which resolves declaration references by walking the hierarchy loaded from an .api.json file.
 */
export class AstReferenceResolver {
	private readonly _collector: Collector;

	private readonly _astSymbolTable: AstSymbolTable;

	private readonly _workingPackage: WorkingPackage;

	public constructor(collector: Collector) {
		this._collector = collector;
		this._astSymbolTable = collector.astSymbolTable;
		this._workingPackage = collector.workingPackage;
	}

	public resolve(declarationReference: tsdoc.DocDeclarationReference): AstDeclaration | ResolverFailure {
		// Is it referring to the working package?
		if (
			declarationReference.packageName !== undefined &&
			declarationReference.packageName !== this._workingPackage.name
		) {
			return new ResolverFailure('External package references are not supported');
		}

		// Is it a path-based import?
		if (declarationReference.importPath) {
			return new ResolverFailure('Import paths are not supported');
		}

		const astModule: AstModule = this._astSymbolTable.fetchAstModuleFromWorkingPackage(
			this._workingPackage.entryPointSourceFile,
		);

		if (declarationReference.memberReferences.length === 0) {
			return new ResolverFailure('Package references are not supported');
		}

		const rootMemberReference: tsdoc.DocMemberReference = declarationReference.memberReferences[0]!;

		const exportName: ResolverFailure | string = this._getMemberReferenceIdentifier(rootMemberReference);
		if (exportName instanceof ResolverFailure) {
			return exportName;
		}

		const rootAstEntity: AstEntity | undefined = this._astSymbolTable.tryGetExportOfAstModule(exportName, astModule);

		if (rootAstEntity === undefined) {
			return new ResolverFailure(`The package "${this._workingPackage.name}" does not have an export "${exportName}"`);
		}

		if (!(rootAstEntity instanceof AstSymbol)) {
			return new ResolverFailure('This type of declaration is not supported yet by the resolver');
		}

		let currentDeclaration: AstDeclaration | ResolverFailure = this._selectDeclaration(
			rootAstEntity.astDeclarations,
			rootMemberReference,
			rootAstEntity.localName,
		);

		if (currentDeclaration instanceof ResolverFailure) {
			return currentDeclaration;
		}

		for (let index = 1; index < declarationReference.memberReferences.length; ++index) {
			const memberReference: tsdoc.DocMemberReference = declarationReference.memberReferences[index]!;

			const memberName: ResolverFailure | string = this._getMemberReferenceIdentifier(memberReference);
			if (memberName instanceof ResolverFailure) {
				return memberName;
			}

			const matchingChildren: readonly AstDeclaration[] = currentDeclaration.findChildrenWithName(memberName);
			if (matchingChildren.length === 0) {
				return new ResolverFailure(`No member was found with name "${memberName}"`);
			}

			const selectedDeclaration: AstDeclaration | ResolverFailure = this._selectDeclaration(
				matchingChildren,
				memberReference,
				memberName,
			);

			if (selectedDeclaration instanceof ResolverFailure) {
				return selectedDeclaration;
			}

			currentDeclaration = selectedDeclaration;
		}

		return currentDeclaration;
	}

	private _getMemberReferenceIdentifier(memberReference: tsdoc.DocMemberReference): ResolverFailure | string {
		if (memberReference.memberSymbol !== undefined) {
			return new ResolverFailure('ECMAScript symbol selectors are not supported');
		}

		if (memberReference.memberIdentifier === undefined) {
			return new ResolverFailure('The member identifier is missing in the root member reference');
		}

		return memberReference.memberIdentifier.identifier;
	}

	private _selectDeclaration(
		astDeclarations: readonly AstDeclaration[],
		memberReference: tsdoc.DocMemberReference,
		astSymbolName: string,
	): AstDeclaration | ResolverFailure {
		const memberSelector: tsdoc.DocMemberSelector | undefined = memberReference.selector;

		if (memberSelector === undefined) {
			if (astDeclarations.length === 1) {
				return astDeclarations[0]!;
			} else {
				// If we found multiple matches, but the extra ones are all ancillary declarations,
				// then return the main declaration.
				const nonAncillaryMatch: AstDeclaration | undefined = this._tryDisambiguateAncillaryMatches(astDeclarations);
				if (nonAncillaryMatch) {
					return nonAncillaryMatch;
				}

				return new ResolverFailure(
					`The reference is ambiguous because "${astSymbolName}"` +
						` has more than one declaration; you need to add a TSDoc member reference selector`,
				);
			}
		}

		switch (memberSelector.selectorKind) {
			case tsdoc.SelectorKind.System:
				return this._selectUsingSystemSelector(astDeclarations, memberSelector, astSymbolName);
			case tsdoc.SelectorKind.Index:
				return this._selectUsingIndexSelector(astDeclarations, memberSelector, astSymbolName);
			default:
				return new ResolverFailure(`The selector "${memberSelector.selector}" is not a supported selector type`);
		}
	}

	private _selectUsingSystemSelector(
		astDeclarations: readonly AstDeclaration[],
		memberSelector: tsdoc.DocMemberSelector,
		astSymbolName: string,
	): AstDeclaration | ResolverFailure {
		const selectorName: string = memberSelector.selector;

		let selectorSyntaxKind: ts.SyntaxKind;

		switch (selectorName) {
			case 'class':
				selectorSyntaxKind = ts.SyntaxKind.ClassDeclaration;
				break;
			case 'enum':
				selectorSyntaxKind = ts.SyntaxKind.EnumDeclaration;
				break;
			case 'function':
				selectorSyntaxKind = ts.SyntaxKind.FunctionDeclaration;
				break;
			case 'interface':
				selectorSyntaxKind = ts.SyntaxKind.InterfaceDeclaration;
				break;
			case 'namespace':
				selectorSyntaxKind = ts.SyntaxKind.ModuleDeclaration;
				break;
			case 'type':
				selectorSyntaxKind = ts.SyntaxKind.TypeAliasDeclaration;
				break;
			case 'variable':
				selectorSyntaxKind = ts.SyntaxKind.VariableDeclaration;
				break;
			default:
				return new ResolverFailure(`Unsupported system selector "${selectorName}"`);
		}

		const matches: AstDeclaration[] = astDeclarations.filter((x) => x.declaration.kind === selectorSyntaxKind);
		if (matches.length === 0) {
			return new ResolverFailure(
				`A declaration for "${astSymbolName}" was not found that matches the TSDoc selector "${selectorName}"`,
			);
		}

		if (matches.length > 1) {
			// If we found multiple matches, but the extra ones are all ancillary declarations,
			// then return the main declaration.
			const nonAncillaryMatch: AstDeclaration | undefined = this._tryDisambiguateAncillaryMatches(matches);
			if (nonAncillaryMatch) {
				return nonAncillaryMatch;
			}

			return new ResolverFailure(
				`More than one declaration "${astSymbolName}" matches the TSDoc selector "${selectorName}"`,
			);
		}

		return matches[0]!;
	}

	private _selectUsingIndexSelector(
		astDeclarations: readonly AstDeclaration[],
		memberSelector: tsdoc.DocMemberSelector,
		astSymbolName: string,
	): AstDeclaration | ResolverFailure {
		const selectorOverloadIndex: number = Number.parseInt(memberSelector.selector, 10);

		const matches: AstDeclaration[] = [];
		for (const astDeclaration of astDeclarations) {
			const overloadIndex: number = this._collector.getOverloadIndex(astDeclaration);
			if (overloadIndex === selectorOverloadIndex) {
				matches.push(astDeclaration);
			}
		}

		if (matches.length === 0) {
			return new ResolverFailure(
				`An overload for "${astSymbolName}" was not found that matches the` +
					` TSDoc selector ":${selectorOverloadIndex}"`,
			);
		}

		if (matches.length > 1) {
			// If we found multiple matches, but the extra ones are all ancillary declarations,
			// then return the main declaration.
			const nonAncillaryMatch: AstDeclaration | undefined = this._tryDisambiguateAncillaryMatches(matches);
			if (nonAncillaryMatch) {
				return nonAncillaryMatch;
			}

			return new ResolverFailure(
				`More than one declaration for "${astSymbolName}" matches the TSDoc selector ":${selectorOverloadIndex}"`,
			);
		}

		return matches[0]!;
	}

	/**
	 * This resolves an ambiguous match in the case where the extra matches are all ancillary declarations,
	 * except for one match that is the main declaration.
	 */
	private _tryDisambiguateAncillaryMatches(matches: readonly AstDeclaration[]): AstDeclaration | undefined {
		let result: AstDeclaration | undefined;

		for (const match of matches) {
			const declarationMetadata: DeclarationMetadata = this._collector.fetchDeclarationMetadata(match);
			if (!declarationMetadata.isAncillary) {
				if (result) {
					return undefined; // more than one match
				}

				result = match;
			}
		}

		return result;
	}
}
