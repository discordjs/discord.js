// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
	ExcerptTokenKind,
	type IExcerptToken,
	type IExcerptTokenRange,
	type IExcerptTokenRangeWithTypeParameters,
} from '@discordjs/api-extractor-model';
import type { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import * as ts from 'typescript';
import type { AstDeclaration } from '../analyzer/AstDeclaration.js';
import { Span } from '../analyzer/Span.js';
import type { DeclarationReferenceGenerator } from './DeclarationReferenceGenerator.js';

/**
 * Used to provide ExcerptBuilder with a list of nodes whose token range we want to capture.
 */
export interface IExcerptBuilderNodeToCapture {
	/**
	 * The node to capture
	 */
	node: ts.Node | undefined;
	/**
	 * The token range whose startIndex/endIndex will be overwritten with the indexes for the
	 * tokens corresponding to IExcerptBuilderNodeToCapture.node
	 */
	tokenRange: IExcerptTokenRange;
}

/**
 * Internal state for ExcerptBuilder
 */
interface IBuildSpanState {
	/**
	 * Tracks whether the last appended token was a separator. If so, and we're in the middle of
	 * capturing a token range, then omit the separator from the range.
	 */
	lastAppendedTokenIsSeparator: boolean;

	referenceGenerator: DeclarationReferenceGenerator;

	/**
	 * The AST node that we will traverse to extract tokens
	 */
	startingNode: ts.Node;

	/**
	 * Normally, the excerpt will include all child nodes for `startingNode`; whereas if `childKindToStopBefore`
	 * is specified, then the node traversal will stop before (i.e. excluding) the first immediate child
	 * of `startingNode` with the specified syntax kind.
	 *
	 * @remarks
	 * For example, suppose the signature is `interface X: Y { z: string }`.  The token `{` has syntax kind
	 * `ts.SyntaxKind.FirstPunctuation`, so we can specify that to truncate the excerpt to `interface X: Y`.
	 */
	stopBeforeChildKind: ts.SyntaxKind | undefined;

	tokenRangesByNode: Map<ts.Node, IExcerptTokenRange>;
}

export class ExcerptBuilder {
	/**
	 * Appends a blank line to the `excerptTokens` list.
	 *
	 * @param excerptTokens - The target token list to append to
	 */
	public static addBlankLine(excerptTokens: IExcerptToken[]): void {
		let newlines = '\n\n';
		// If the existing text already ended with a newline, then only append one newline
		if (excerptTokens.length > 0) {
			const previousText: string = excerptTokens[excerptTokens.length - 1]!.text;
			if (previousText.endsWith('\n')) {
				newlines = '\n';
			}
		}

		excerptTokens.push({ kind: ExcerptTokenKind.Content, text: newlines });
	}

	/**
	 * Appends the signature for the specified `AstDeclaration` to the `excerptTokens` list.
	 *
	 * @param excerptTokens - The target token list to append to
	 * @param astDeclaration - The declaration
	 * @param nodesToCapture - A list of child nodes whose token ranges we want to capture
	 */
	public static addDeclaration(
		excerptTokens: IExcerptToken[],
		astDeclaration: AstDeclaration,
		nodesToCapture: IExcerptBuilderNodeToCapture[],
		referenceGenerator: DeclarationReferenceGenerator,
	): void {
		let stopBeforeChildKind: ts.SyntaxKind | undefined;

		switch (astDeclaration.declaration.kind) {
			case ts.SyntaxKind.ClassDeclaration:
			case ts.SyntaxKind.EnumDeclaration:
			case ts.SyntaxKind.InterfaceDeclaration:
				// FirstPunctuation = "{"
				stopBeforeChildKind = ts.SyntaxKind.FirstPunctuation;
				break;
			case ts.SyntaxKind.ModuleDeclaration:
				// ModuleBlock = the "{ ... }" block
				stopBeforeChildKind = ts.SyntaxKind.ModuleBlock;
				break;
			default:
				break;
		}

		const span: Span = new Span(astDeclaration.declaration);

		const tokenRangesByNode: Map<ts.Node, IExcerptTokenRange> = new Map<ts.Node, IExcerptTokenRange>();
		for (const excerpt of nodesToCapture || []) {
			if (excerpt.node) {
				tokenRangesByNode.set(excerpt.node, excerpt.tokenRange);
			}
		}

		ExcerptBuilder._buildSpan(excerptTokens, span, {
			referenceGenerator,
			startingNode: span.node,
			stopBeforeChildKind,
			tokenRangesByNode,
			lastAppendedTokenIsSeparator: false,
		});
		ExcerptBuilder._condenseTokens(excerptTokens, [...tokenRangesByNode.values()]);
	}

	public static createEmptyTokenRange(): IExcerptTokenRange {
		return { startIndex: 0, endIndex: 0 };
	}

	public static createEmptyTokenRangeWithTypeParameters(): IExcerptTokenRangeWithTypeParameters {
		return { startIndex: 0, endIndex: 0, typeParameters: [] };
	}

	private static _isPrimitiveKeyword(node: ts.Node): boolean {
		switch (node.kind) {
			case ts.SyntaxKind.AnyKeyword:
			case ts.SyntaxKind.BigIntKeyword:
			case ts.SyntaxKind.BooleanKeyword:
			case ts.SyntaxKind.NeverKeyword:
			case ts.SyntaxKind.NumberKeyword:
			case ts.SyntaxKind.ObjectKeyword:
			case ts.SyntaxKind.StringKeyword:
			case ts.SyntaxKind.SymbolKeyword:
			case ts.SyntaxKind.UnknownKeyword:
			case ts.SyntaxKind.VoidKeyword:
			case ts.SyntaxKind.TypeOfKeyword:
			case ts.SyntaxKind.UndefinedKeyword:
			case ts.SyntaxKind.NullKeyword:
				return true;
			default:
				return false;
		}
	}

	private static _isRedundantBarAfterColon(span: Span) {
		return (
			span.kind === ts.SyntaxKind.BarToken &&
			span.previousSibling === undefined &&
			(span.parent?.parent?.previousSibling?.kind === ts.SyntaxKind.LessThanToken ||
				span.parent?.parent?.previousSibling?.kind === ts.SyntaxKind.ColonToken)
		);
	}

	private static _buildSpan(excerptTokens: IExcerptToken[], span: Span, state: IBuildSpanState): boolean {
		if (span.kind === ts.SyntaxKind.JSDocComment) {
			// Discard any comments
			return true;
		}

		// Can this node start a excerpt?
		const capturedTokenRange: IExcerptTokenRange | undefined = state.tokenRangesByNode.get(span.node);
		let excerptStartIndex = 0;

		if (capturedTokenRange) {
			// We will assign capturedTokenRange.startIndex to be the index of the next token to be appended
			excerptStartIndex = excerptTokens.length;
		}

		if (span.prefix) {
			let canonicalReference: DeclarationReference | undefined;

			if (ts.isIdentifier(span.node)) {
				const name: ts.Identifier = span.node;
				canonicalReference = state.referenceGenerator.getDeclarationReferenceForIdentifier(name);
			}

			if (canonicalReference) {
				ExcerptBuilder._appendToken(excerptTokens, ExcerptTokenKind.Reference, span.prefix, canonicalReference);
			} else if (
				ExcerptBuilder._isPrimitiveKeyword(span.node) ||
				(ts.isIdentifier(span.node) &&
					((ts.isTypeReferenceNode(span.node.parent) && span.node.parent.typeName === span.node) ||
						(ts.isTypeParameterDeclaration(span.node.parent) && span.node.parent.name === span.node)))
			) {
				ExcerptBuilder._appendToken(excerptTokens, ExcerptTokenKind.Reference, span.prefix);
			} else if (!ExcerptBuilder._isRedundantBarAfterColon(span)) {
				ExcerptBuilder._appendToken(excerptTokens, ExcerptTokenKind.Content, span.prefix);
			}

			state.lastAppendedTokenIsSeparator = false;
		}

		for (const child of span.children) {
			if (span.node === state.startingNode && state.stopBeforeChildKind && child.kind === state.stopBeforeChildKind) {
				// We reached a child whose kind is stopBeforeChildKind, so stop traversing
				return false;
			}

			if (!this._buildSpan(excerptTokens, child, state)) {
				return false;
			}
		}

		if (span.suffix) {
			ExcerptBuilder._appendToken(excerptTokens, ExcerptTokenKind.Content, span.suffix);
			state.lastAppendedTokenIsSeparator = false;
		}

		if (span.separator) {
			ExcerptBuilder._appendToken(
				excerptTokens,
				ExcerptTokenKind.Content,
				span.separator.replaceAll('\n', '').replaceAll(/\s{2}/g, ' '),
			);
			state.lastAppendedTokenIsSeparator = true;
		}

		// Are we building a excerpt?  If so, set its range
		if (capturedTokenRange) {
			capturedTokenRange.startIndex = excerptStartIndex;

			// We will assign capturedTokenRange.startIndex to be the index after the last token
			// that was appended so far. However, if the last appended token was a separator, omit
			// it from the range.
			let excerptEndIndex: number = excerptTokens.length;
			if (state.lastAppendedTokenIsSeparator) {
				excerptEndIndex--;
			}

			capturedTokenRange.endIndex = excerptEndIndex;
		}

		return true;
	}

	private static _appendToken(
		excerptTokens: IExcerptToken[],
		excerptTokenKind: ExcerptTokenKind,
		text: string,
		canonicalReference?: DeclarationReference,
	): void {
		if (text.length === 0) {
			return;
		}

		const excerptToken: IExcerptToken = { kind: excerptTokenKind, text };
		if (canonicalReference !== undefined) {
			excerptToken.canonicalReference = canonicalReference.toString();
		}

		excerptTokens.push(excerptToken);
	}

	/**
	 * Condenses the provided excerpt tokens by merging tokens where possible. Updates the provided token ranges to
	 * remain accurate after token merging.
	 *
	 * @remarks
	 * For example, suppose we have excerpt tokens ["A", "B", "C"] and a token range [0, 2]. If the excerpt tokens
	 * are condensed to ["AB", "C"], then the token range would be updated to [0, 1]. Note that merges are only
	 * performed if they are compatible with the provided token ranges. In the example above, if our token range was
	 * originally [0, 1], we would not be able to merge tokens "A" and "B".
	 */
	private static _condenseTokens(excerptTokens: IExcerptToken[], tokenRanges: IExcerptTokenRange[]): void {
		// This set is used to quickly lookup a start or end index.
		const startOrEndIndices: Set<number> = new Set();
		for (const tokenRange of tokenRanges) {
			startOrEndIndices.add(tokenRange.startIndex);
			startOrEndIndices.add(tokenRange.endIndex);
		}

		for (let currentIndex = 1; currentIndex < excerptTokens.length; ++currentIndex) {
			while (currentIndex < excerptTokens.length) {
				const prevPrevToken: IExcerptToken | undefined = excerptTokens[currentIndex - 2]; // May be undefined
				const prevToken: IExcerptToken = excerptTokens[currentIndex - 1]!;
				const currentToken: IExcerptToken = excerptTokens[currentIndex]!;

				// The number of excerpt tokens that are merged in this iteration. We need this to determine
				// how to update the start and end indices of our token ranges.
				let mergeCount: number;

				// There are two types of merges that can occur. We only perform these merges if they are
				// compatible with all of our token ranges.
				if (
					prevPrevToken &&
					prevPrevToken.kind === ExcerptTokenKind.Reference &&
					prevToken.kind === ExcerptTokenKind.Content &&
					prevToken.text.trim() === '.' &&
					currentToken.kind === ExcerptTokenKind.Reference &&
					!startOrEndIndices.has(currentIndex) &&
					!startOrEndIndices.has(currentIndex - 1)
				) {
					// If the current token is a reference token, the previous token is a ".", and the previous-
					// previous token is a reference token, then merge all three tokens into a reference token.
					//
					// For example: Given ["MyNamespace" (R), ".", "MyClass" (R)], tokens "." and "MyClass" might
					// be merged into "MyNamespace". The condensed token would be ["MyNamespace.MyClass" (R)].
					prevPrevToken.text += prevToken.text + currentToken.text;
					prevPrevToken.canonicalReference = currentToken.canonicalReference;
					mergeCount = 2;
					currentIndex--;
				} else if (
					// If the current and previous tokens are both content tokens, then merge the tokens into a
					// single content token. For example: Given ["export ", "declare class"], these tokens
					// might be merged into "export declare class".
					prevToken.kind === ExcerptTokenKind.Content &&
					prevToken.kind === currentToken.kind &&
					!startOrEndIndices.has(currentIndex)
				) {
					prevToken.text += currentToken.text;
					// Remove BarTokens from excerpts if they immediately follow a LessThanToken, e.g. `Promise< | Something>`
					// would become `Promise<Something>`
					if (/<(?:\s*\||\s+)/.test(prevToken.text)) {
						prevToken.text = prevToken.text.replaceAll(/<\s*\|?\s*/g, '<');
					}

					if (/\s+>/.test(prevToken.text)) {
						prevToken.text = prevToken.text.replaceAll(/\s*>/g, '>');
					}

					mergeCount = 1;
				} else {
					// Otherwise, no merging can occur here. Continue to the next index.
					break;
				}

				// Remove the now redundant excerpt token(s), as they were merged into a previous token.
				excerptTokens.splice(currentIndex, mergeCount);

				// Update the start and end indices for all token ranges based upon how many excerpt
				// tokens were merged and in what positions.
				for (const tokenRange of tokenRanges) {
					if (tokenRange.startIndex > currentIndex) {
						tokenRange.startIndex -= mergeCount;
					}

					if (tokenRange.endIndex > currentIndex) {
						tokenRange.endIndex -= mergeCount;
					}
				}

				// Clear and repopulate our set with the updated indices.
				startOrEndIndices.clear();
				for (const tokenRange of tokenRanges) {
					startOrEndIndices.add(tokenRange.startIndex);
					startOrEndIndices.add(tokenRange.endIndex);
				}
			}
		}
	} /*

	private static _isDeclarationName(name: ts.Identifier): boolean {
		return ExcerptBuilder._isDeclaration(name.parent) && name.parent.name === name;
	}

	private static _isDeclaration(node: ts.Node): node is ts.NamedDeclaration {
		switch (node.kind) {
			case ts.SyntaxKind.FunctionDeclaration:
			case ts.SyntaxKind.FunctionExpression:
			case ts.SyntaxKind.VariableDeclaration:
			case ts.SyntaxKind.Parameter:
			case ts.SyntaxKind.EnumDeclaration:
			case ts.SyntaxKind.ClassDeclaration:
			case ts.SyntaxKind.ClassExpression:
			case ts.SyntaxKind.ModuleDeclaration:
			case ts.SyntaxKind.MethodDeclaration:
			case ts.SyntaxKind.MethodSignature:
			case ts.SyntaxKind.PropertyDeclaration:
			case ts.SyntaxKind.PropertySignature:
			case ts.SyntaxKind.GetAccessor:
			case ts.SyntaxKind.SetAccessor:
			case ts.SyntaxKind.InterfaceDeclaration:
			case ts.SyntaxKind.TypeAliasDeclaration:
			case ts.SyntaxKind.TypeParameter:
			case ts.SyntaxKind.EnumMember:
			case ts.SyntaxKind.BindingElement:
				return true;
			default:
				return false;
		}
	} // */
}
