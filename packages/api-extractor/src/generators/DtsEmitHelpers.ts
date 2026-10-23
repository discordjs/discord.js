// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { InternalError } from '@rushstack/node-core-library';
import * as ts from 'typescript';
import { AstDeclaration } from '../analyzer/AstDeclaration.js';
import { AstImport, AstImportKind } from '../analyzer/AstImport.js';
import { SourceFileLocationFormatter } from '../analyzer/SourceFileLocationFormatter.js';
import type { Span } from '../analyzer/Span.js';
import { TypeScriptHelpers } from '../analyzer/TypeScriptHelpers.js';
import type { Collector } from '../collector/Collector.js';
import type { CollectorEntity } from '../collector/CollectorEntity.js';
import type { IndentedWriter } from './IndentedWriter.js';

/**
 * Some common code shared between DtsRollupGenerator and ApiReportGenerator.
 */
export class DtsEmitHelpers {
	public static emitImport(writer: IndentedWriter, collectorEntity: CollectorEntity, astImport: AstImport): void {
		const importPrefix: string = astImport.isTypeOnlyEverywhere ? 'import type' : 'import';

		switch (astImport.importKind) {
			case AstImportKind.DefaultImport:
				if (collectorEntity.nameForEmit === astImport.exportName) {
					writer.write(`${importPrefix} ${astImport.exportName}`);
				} else {
					writer.write(`${importPrefix} { default as ${collectorEntity.nameForEmit} }`);
				}

				writer.writeLine(` from '${astImport.modulePath}';`);
				break;
			case AstImportKind.NamedImport:
				if (collectorEntity.nameForEmit === astImport.exportName) {
					writer.write(`${importPrefix} { ${astImport.exportName} }`);
				} else {
					writer.write(`${importPrefix} { ${astImport.exportName} as ${collectorEntity.nameForEmit} }`);
				}

				writer.writeLine(` from '${astImport.modulePath}';`);
				break;
			case AstImportKind.StarImport:
				writer.writeLine(`${importPrefix} * as ${collectorEntity.nameForEmit} from '${astImport.modulePath}';`);
				break;
			case AstImportKind.EqualsImport:
				writer.writeLine(`${importPrefix} ${collectorEntity.nameForEmit} = require('${astImport.modulePath}');`);
				break;
			case AstImportKind.ImportType:
				if (astImport.exportName) {
					const topExportName: string = astImport.exportName.split('.')[0]!;
					if (collectorEntity.nameForEmit === topExportName) {
						writer.write(`${importPrefix} { ${topExportName} }`);
					} else {
						writer.write(`${importPrefix} { ${topExportName} as ${collectorEntity.nameForEmit} }`);
					}

					writer.writeLine(` from '${astImport.modulePath}';`);
				} else {
					writer.writeLine(`${importPrefix} * as ${collectorEntity.nameForEmit} from '${astImport.modulePath}';`);
				}

				break;
			default:
				throw new InternalError('Unimplemented AstImportKind');
		}
	}

	public static emitNamedExport(writer: IndentedWriter, exportName: string, collectorEntity: CollectorEntity): void {
		if (exportName === ts.InternalSymbolName.Default) {
			writer.writeLine(`export default ${collectorEntity.nameForEmit};`);
		} else if (collectorEntity.nameForEmit === exportName) {
			writer.writeLine(`export { ${exportName} }`);
		} else {
			writer.writeLine(`export { ${collectorEntity.nameForEmit} as ${exportName} }`);
		}
	}

	public static emitStarExports(writer: IndentedWriter, collector: Collector): void {
		if (collector.starExportedExternalModulePaths.length > 0) {
			writer.writeLine();
			for (const starExportedExternalModulePath of collector.starExportedExternalModulePaths) {
				writer.writeLine(`export * from "${starExportedExternalModulePath}";`);
			}
		}
	}

	public static modifyImportTypeSpan(
		collector: Collector,
		span: Span,
		astDeclaration: AstDeclaration,
		modifyNestedSpan: (childSpan: Span, childAstDeclaration: AstDeclaration) => void,
	): void {
		const node: ts.ImportTypeNode = span.node as ts.ImportTypeNode;
		const referencedEntity: CollectorEntity | undefined = collector.tryGetEntityForNode(node);

		if (referencedEntity) {
			if (!referencedEntity.nameForEmit) {
				// This should never happen

				throw new InternalError('referencedEntry.nameForEmit is undefined');
			}

			let typeArgumentsText = '';

			if (node.typeArguments && node.typeArguments.length > 0) {
				// Type arguments have to be processed and written to the document
				const lessThanTokenPos: number = span.children.findIndex(
					(childSpan) => childSpan.node.kind === ts.SyntaxKind.LessThanToken,
				);
				const greaterThanTokenPos: number = span.children.findIndex(
					(childSpan) => childSpan.node.kind === ts.SyntaxKind.GreaterThanToken,
				);

				if (lessThanTokenPos < 0 || greaterThanTokenPos <= lessThanTokenPos) {
					throw new InternalError(
						`Invalid type arguments: ${node.getText()}\n` + SourceFileLocationFormatter.formatDeclaration(node),
					);
				}

				const typeArgumentsSpans: Span[] = span.children.slice(lessThanTokenPos + 1, greaterThanTokenPos);

				// Apply modifications to Span elements of typeArguments
				for (const childSpan of typeArgumentsSpans) {
					const childAstDeclaration: AstDeclaration = AstDeclaration.isSupportedSyntaxKind(childSpan.kind)
						? collector.astSymbolTable.getChildAstDeclarationByNode(childSpan.node, astDeclaration)
						: astDeclaration;

					modifyNestedSpan(childSpan, childAstDeclaration);
				}

				const typeArgumentsStrings: string[] = typeArgumentsSpans.map((childSpan) => childSpan.getModifiedText());
				typeArgumentsText = `<${typeArgumentsStrings.join(', ')}>`;
			}

			const separatorAfter: string = /(?<separator>\s*)$/.exec(span.getText())?.groups?.separator ?? '';

			if (
				referencedEntity.astEntity instanceof AstImport &&
				referencedEntity.astEntity.importKind === AstImportKind.ImportType &&
				referencedEntity.astEntity.exportName
			) {
				// For an ImportType with a namespace chain, only the top namespace is imported.
				// Must add the original nested qualifiers to the rolled up import.
				const qualifiersText: string = node.qualifier?.getText() ?? '';
				const nestedQualifiersStart: number = qualifiersText.indexOf('.');
				// Including the leading "."
				const nestedQualifiersText: string =
					nestedQualifiersStart >= 0 ? qualifiersText.slice(Math.max(0, nestedQualifiersStart)) : '';

				const replacement = `${referencedEntity.nameForEmit}${nestedQualifiersText}${typeArgumentsText}${separatorAfter}`;

				span.modification.skipAll();
				span.modification.prefix = replacement;
			} else {
				// Replace with internal symbol or AstImport
				span.modification.skipAll();
				span.modification.prefix = `${referencedEntity.nameForEmit}${typeArgumentsText}${separatorAfter}`;
			}
		}
	}

	/**
	 * Checks if an export keyword is part of an ExportDeclaration inside a namespace
	 * (e.g., "export \{ Foo, Bar \};" inside "declare namespace SDK \{ ... \}").
	 * In that case, the export keyword must be preserved, otherwise the output is invalid TypeScript.
	 */
	public static isExportKeywordInNamespaceExportDeclaration(node: ts.Node): boolean {
		if (node.parent && ts.isExportDeclaration(node.parent)) {
			const moduleBlock: ts.ModuleBlock | undefined = TypeScriptHelpers.findFirstParent(
				node,
				ts.SyntaxKind.ModuleBlock,
			);
			if (moduleBlock) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Given an array that includes some parameter nodes, this returns an array of the same length;
	 * elements that are not undefined correspond to a parameter that should be renamed.
	 */
	public static forEachParameterToNormalize(
		nodes: readonly ts.Node[],
		action: (parameter: ts.ParameterDeclaration, syntheticName: string | undefined) => void,
	): void {
		let actionIndex = 0;

		// Optimistically assume that no parameters need to be normalized
		for (actionIndex = 0; actionIndex < nodes.length; ++actionIndex) {
			const parameter: ts.Node = nodes[actionIndex]!;
			if (!ts.isParameter(parameter)) {
				continue;
			}

			if (ts.isObjectBindingPattern(parameter.name) || ts.isArrayBindingPattern(parameter.name)) {
				// Our optimistic assumption was not true; we'll need to stop and calculate alreadyUsedNames
				break;
			}

			action(parameter, undefined);
		}

		if (actionIndex === nodes.length) {
			// Our optimistic assumption was true
			return;
		}

		// First, calculate alreadyUsedNames
		const alreadyUsedNames: string[] = [];

		for (const node of nodes) {
			const parameter: ts.Node = node!;
			if (!ts.isParameter(parameter)) {
				continue;
			}

			if (!(ts.isObjectBindingPattern(parameter.name) || ts.isArrayBindingPattern(parameter.name))) {
				alreadyUsedNames.push(parameter.name.text.trim());
			}
		}

		// Now continue with the rest of the actions
		for (; actionIndex < nodes.length; ++actionIndex) {
			const parameter: ts.Node = nodes[actionIndex]!;
			if (!ts.isParameter(parameter)) {
				continue;
			}

			if (ts.isObjectBindingPattern(parameter.name) || ts.isArrayBindingPattern(parameter.name)) {
				// Examples:
				//
				//      function f({ y, z }: { y: string, z: string })
				// ---> function f(options: { y: string, z: string })
				//
				//      function f(x: number, [a, b]: [number, number])
				// ---> function f(x: number, options: [number, number])
				//
				// Example of a naming collision:
				//
				//      function f({ a }: { a: string }, { b }: { b: string }, options2: string)
				// ---> function f(options: { a: string }, options3: { b: string }, options2: string)
				const baseName = 'options';
				let counter = 2;

				let syntheticName: string = baseName;
				while (alreadyUsedNames.includes(syntheticName)) {
					syntheticName = `${baseName}${counter++}`;
				}

				alreadyUsedNames.push(syntheticName);

				action(parameter, syntheticName);
			} else {
				action(parameter, undefined);
			}
		}
	}

	public static normalizeParameterNames(signatureSpan: Span): void {
		const syntheticNamesByNode: Map<ts.Node, string> = new Map();

		DtsEmitHelpers.forEachParameterToNormalize(
			signatureSpan.node.getChildren(),
			(parameter: ts.ParameterDeclaration, syntheticName: string | undefined): void => {
				if (syntheticName !== undefined) {
					syntheticNamesByNode.set(parameter.name, syntheticName);
				}
			},
		);

		if (syntheticNamesByNode.size > 0) {
			signatureSpan.forEach((childSpan: Span): void => {
				const syntheticName: string | undefined = syntheticNamesByNode.get(childSpan.node);
				if (syntheticName !== undefined) {
					childSpan.modification.prefix = syntheticName;
					childSpan.modification.suffix = '';
					childSpan.modification.omitChildren = true;
				}
			});
		}
	}
}
