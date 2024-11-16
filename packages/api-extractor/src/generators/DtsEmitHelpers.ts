// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { InternalError } from '@rushstack/node-core-library';
import * as ts from 'typescript';
import { AstDeclaration } from '../analyzer/AstDeclaration.js';
import { AstImport, AstImportKind } from '../analyzer/AstImport.js';
import { SourceFileLocationFormatter } from '../analyzer/SourceFileLocationFormatter.js';
import type { Span } from '../analyzer/Span.js';
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
}
