// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
	ExcerptTokenKind,
	type IExcerptToken,
	type IExcerptTokenRange,
	type IExcerptTokenRangeWithTypeParameters,
} from '@discordjs/api-extractor-model';
import type { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import * as ts from 'typescript/ast';
import type { AstDeclaration } from '../analyzer/AstDeclaration.js';
import { Span } from '../analyzer/Span.js';
import type { IWorkingPackageEntryPoint } from '../collector/WorkingPackage.js';
import { condenseTokens } from './condenseTokens.js';
import type { DeclarationReferenceGenerator } from './DeclarationReferenceGenerator.js';

/**
 * Used to provide ExcerptBuilder with a list of nodes whose token range we want to capture.
 */
export interface IExcerptBuilderNodeTransform {
	/**
	 * A token range whose startIndex/endIndex will be overwritten with the indexes for the
	 * tokens corresponding to IExcerptBuilderNodeTransform.node
	 */
	captureTokenRange?: IExcerptTokenRange;

	/**
	 * The node to process
	 */
	node: ts.Node;

	/**
	 * +   * Text that will replace the text of the given node during emit.
	 */
	replacementText?: string;
}

/**
 * Internal state for ExcerptBuilder
 */
interface IBuildSpanState {
	entryPoint: IWorkingPackageEntryPoint;

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

	transformsByNode: Map<ts.Node, IExcerptBuilderNodeTransform>;
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
	 * @param nodeTransforms - A list of child nodes whose token ranges we want to capture
	 */
	public static addDeclaration(
		excerptTokens: IExcerptToken[],
		astDeclaration: AstDeclaration,
		nodeTransforms: IExcerptBuilderNodeTransform[],
		referenceGenerator: DeclarationReferenceGenerator,
		entryPoint: IWorkingPackageEntryPoint,
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

		const transformsByNode: Map<ts.Node, IExcerptBuilderNodeTransform> = new Map<
			ts.Node,
			IExcerptBuilderNodeTransform
		>();
		const captureTokenRanges: IExcerptTokenRange[] = [];
		for (const nodeTransform of nodeTransforms || []) {
			transformsByNode.set(nodeTransform.node, nodeTransform);
			if (nodeTransform.captureTokenRange) {
				captureTokenRanges.push(nodeTransform.captureTokenRange);
			}
		}

		_buildSpan(excerptTokens, span, {
			entryPoint,
			referenceGenerator,
			startingNode: span.node,
			stopBeforeChildKind,
			transformsByNode,
			lastAppendedTokenIsSeparator: false,
		});
		condenseTokens(excerptTokens, captureTokenRanges);
	}

	public static createEmptyTokenRange(): IExcerptTokenRange {
		return { startIndex: 0, endIndex: 0 };
	}

	public static createEmptyTokenRangeWithTypeParameters(): IExcerptTokenRangeWithTypeParameters {
		return { startIndex: 0, endIndex: 0, typeParameters: [] };
	}
}

function _isPrimitiveKeyword(node: ts.Node): boolean {
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

function _isRedundantBarAfterColon(span: Span) {
	return (
		span.kind === ts.SyntaxKind.BarToken &&
		span.previousSibling === undefined &&
		(span.parent?.parent?.previousSibling?.kind === ts.SyntaxKind.LessThanToken ||
			span.parent?.parent?.previousSibling?.kind === ts.SyntaxKind.ColonToken)
	);
}

/**
 * @returns false if we encountered a token that causes iteration to stop.
 */
function _buildSpan(excerptTokens: IExcerptToken[], span: Span, state: IBuildSpanState): boolean {
	if (span.kind === ts.SyntaxKind.JSDoc) {
		// Discard any comments
		return true;
	}

	// Can this node start a excerpt?
	const transform: IExcerptBuilderNodeTransform | undefined = state.transformsByNode.get(span.node);

	let captureTokenRange: IExcerptTokenRange | undefined;

	if (transform) {
		captureTokenRange = transform.captureTokenRange;
		if (transform.replacementText !== undefined) {
			excerptTokens.push({
				kind: ExcerptTokenKind.Content,
				text: transform.replacementText,
			});
			state.lastAppendedTokenIsSeparator = false;

			if (captureTokenRange) {
				captureTokenRange.startIndex = excerptTokens.length;
				captureTokenRange.endIndex = captureTokenRange.startIndex + 1;
			}

			return true;
		}
	}

	let excerptStartIndex = 0;

	if (captureTokenRange) {
		// We will assign capturedTokenRange.startIndex to be the index of the next token to be appended
		excerptStartIndex = excerptTokens.length;
	}

	if (span.prefix) {
		let canonicalReference: DeclarationReference | undefined;

		if (ts.isIdentifier(span.node)) {
			const name: ts.Identifier = span.node;
			canonicalReference = state.referenceGenerator.getDeclarationReferenceForIdentifier(name, state.entryPoint);
		}

		if (canonicalReference) {
			_appendToken(excerptTokens, ExcerptTokenKind.Reference, span.prefix, canonicalReference);
		} else if (
			_isPrimitiveKeyword(span.node) ||
			(ts.isIdentifier(span.node) &&
				((ts.isTypeReferenceNode(span.node.parent) && span.node.parent.typeName === span.node) ||
					(ts.isTypeParameterDeclaration(span.node.parent) && span.node.parent.name === span.node)))
		) {
			_appendToken(excerptTokens, ExcerptTokenKind.Reference, span.prefix);
		} else if (!_isRedundantBarAfterColon(span)) {
			_appendToken(excerptTokens, ExcerptTokenKind.Content, span.prefix);
		}

		state.lastAppendedTokenIsSeparator = false;
	}

	for (const child of span.children) {
		if (span.node === state.startingNode && state.stopBeforeChildKind && child.kind === state.stopBeforeChildKind) {
			// We reached a child whose kind is stopBeforeChildKind, so stop traversing
			return false;
		}

		if (!_buildSpan(excerptTokens, child, state)) {
			return false;
		}
	}

	if (span.suffix) {
		_appendToken(excerptTokens, ExcerptTokenKind.Content, span.suffix);
		state.lastAppendedTokenIsSeparator = false;
	}

	if (span.separator) {
		_appendToken(
			excerptTokens,
			ExcerptTokenKind.Content,
			span.separator.replaceAll('\n', '').replaceAll(/\s{2}/g, ' '),
		);
		state.lastAppendedTokenIsSeparator = true;
	}

	// Are we building a excerpt?  If so, set its range
	if (captureTokenRange) {
		captureTokenRange.startIndex = excerptStartIndex;

		// We will assign capturedTokenRange.startIndex to be the index after the last token
		// that was appended so far. However, if the last appended token was a separator, omit
		// it from the range.
		let excerptEndIndex: number = excerptTokens.length;
		if (state.lastAppendedTokenIsSeparator) {
			excerptEndIndex--;
		}

		captureTokenRange.endIndex = excerptEndIndex;
	}

	return true;
}

function _appendToken(
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
} /*

function _isDeclarationName(name: ts.Identifier): boolean {
	return _isDeclaration(name.parent) && name.parent.name === name;
}

function _isDeclaration(node: ts.Node): node is ts.NamedDeclaration {
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
