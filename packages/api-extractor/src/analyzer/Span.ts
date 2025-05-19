/* eslint-disable promise/prefer-await-to-callbacks */
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { InternalError, Sort, Text } from '@rushstack/node-core-library';
import * as ts from 'typescript';
import { IndentedWriter } from '../generators/IndentedWriter.js';

interface IWriteModifiedTextOptions {
	indentDocCommentState: IndentDocCommentState;
	separatorOverride: string | undefined;
	writer: IndentedWriter;
}

enum IndentDocCommentState {
	/**
	 * `indentDocComment` was not requested for this subtree.
	 */
	Inactive = 0,
	/**
	 * `indentDocComment` was requested and we are looking for the opening `/` `*`
	 */
	AwaitingOpenDelimiter = 1,
	/**
	 * `indentDocComment` was requested and we are looking for the closing `*` `/`
	 */
	AwaitingCloseDelimiter = 2,
	/**
	 * `indentDocComment` was requested and we have finished indenting the comment.
	 */
	Done = 3,
}

/**
 * Choices for SpanModification.indentDocComment.
 */
export enum IndentDocCommentScope {
	/**
	 * Do not detect and indent comments.
	 */
	None = 0,

	/**
	 * Look for one doc comment in the {@link Span.prefix} text only.
	 */
	PrefixOnly = 1,

	/**
	 * Look for one doc comment potentially distributed across the Span and its children.
	 */
	SpanAndChildren = 2,
}

/**
 * Specifies various transformations that will be performed by Span.getModifiedText().
 */
export class SpanModification {
	/**
	 * If true, all of the child spans will be omitted from the Span.getModifiedText() output.
	 *
	 * @remarks
	 * Also, the modify() operation will not recurse into these spans.
	 */
	public omitChildren: boolean = false;

	/**
	 * If true, then the Span.separator will be removed from the Span.getModifiedText() output.
	 */
	public omitSeparatorAfter: boolean = false;

	/**
	 * If true, then Span.getModifiedText() will sort the immediate children according to their Span.sortKey
	 * property.  The separators will also be fixed up to ensure correct indentation.  If the Span.sortKey is undefined
	 * for some items, those items will not be moved, i.e. their array indexes will be unchanged.
	 */
	public sortChildren: boolean = false;

	/**
	 * Used if the parent span has Span.sortChildren=true.
	 */
	public sortKey: string | undefined;

	/**
	 * Optionally configures getModifiedText() to search for a "/*" doc comment and indent it.
	 * At most one comment is detected.
	 *
	 * @remarks
	 * The indentation can be applied to the `Span.modifier.prefix` only, or it can be applied to the
	 * full subtree of nodes (as needed for `ts.SyntaxKind.JSDocComment` trees).  However the enabled
	 * scopes must not overlap.
	 *
	 * This feature is enabled selectively because (1) we do not want to accidentally match `/*` appearing
	 * in a string literal or other expression that is not a comment, and (2) parsing comments is relatively
	 * expensive.
	 */
	public indentDocComment: IndentDocCommentScope = IndentDocCommentScope.None;

	private readonly _span: Span;

	private _prefix: string | undefined;

	private _suffix: string | undefined;

	public constructor(span: Span) {
		this._span = span;
		this.reset();
	}

	/**
	 * Allows the Span.prefix text to be changed.
	 */
	public get prefix(): string {
		return this._prefix ?? this._span.prefix;
	}

	public set prefix(value: string) {
		this._prefix = value;
	}

	/**
	 * Allows the Span.suffix text to be changed.
	 */
	public get suffix(): string {
		return this._suffix ?? this._span.suffix;
	}

	public set suffix(value: string) {
		this._suffix = value;
	}

	/**
	 * Reverts any modifications made to this object.
	 */
	public reset(): void {
		this.omitChildren = false;
		this.omitSeparatorAfter = false;
		this.sortChildren = false;
		this.sortKey = undefined;
		this._prefix = undefined;
		this._suffix = undefined;
		if (this._span.kind === ts.SyntaxKind.JSDocComment) {
			this.indentDocComment = IndentDocCommentScope.SpanAndChildren;
		}
	}

	/**
	 * Effectively deletes the Span from the tree, by skipping its children, skipping its separator,
	 * and setting its prefix/suffix to the empty string.
	 */
	public skipAll(): void {
		this.prefix = '';
		this.suffix = '';
		this.omitChildren = true;
		this.omitSeparatorAfter = true;
	}
}

/**
 * The Span class provides a simple way to rewrite TypeScript source files
 * based on simple syntax transformations, i.e. without having to process deeper aspects
 * of the underlying grammar.  An example transformation might be deleting JSDoc comments
 * from a source file.
 *
 * @remarks
 * TypeScript's abstract syntax tree (AST) is represented using Node objects.
 * The Node text ignores its surrounding whitespace, and does not have an ordering guarantee.
 * For example, a JSDocComment node can be a child of a FunctionDeclaration node, even though
 * the actual comment precedes the function in the input stream.
 *
 * The Span class is a wrapper for a single Node, that provides access to every character
 * in the input stream, such that Span.getText() will exactly reproduce the corresponding
 * full Node.getText() output.
 *
 * A Span is comprised of these parts, which appear in sequential order:
 * - A prefix
 * - A collection of child spans
 * - A suffix
 * - A separator (e.g. whitespace between this span and the next item in the tree)
 *
 * These parts can be modified via Span.modification.  The modification is applied by
 * calling Span.getModifiedText().
 */
export class Span {
	public readonly node: ts.Node;

	// To improve performance, substrings are not allocated until actually needed
	public readonly startIndex: number;

	public readonly endIndex: number;

	public readonly children: Span[];

	public readonly modification: SpanModification;

	private readonly _parent: Span | undefined;

	private readonly _previousSibling: Span | undefined;

	private readonly _nextSibling: Span | undefined;

	private readonly _separatorStartIndex: number;

	private readonly _separatorEndIndex: number;

	public constructor(node: ts.Node) {
		this.node = node;
		this.startIndex = node.kind === ts.SyntaxKind.SourceFile ? node.getFullStart() : node.getStart();
		this.endIndex = node.end;
		this._separatorStartIndex = 0;
		this._separatorEndIndex = 0;
		this.children = [];
		this.modification = new SpanModification(this);

		let previousChildSpan: Span | undefined;

		for (const childNode of this.node.getChildren() || []) {
			const childSpan: Span = new Span(childNode);
			// @ts-expect-error assigning private readonly properties on creation only
			childSpan._parent = this;
			// @ts-expect-error assigning private readonly properties on creation only
			childSpan._previousSibling = previousChildSpan;

			if (previousChildSpan) {
				// @ts-expect-error assigning private readonly properties on creation only
				previousChildSpan._nextSibling = childSpan;
			}

			this.children.push(childSpan);

			// Normalize the bounds so that a child is never outside its parent
			if (childSpan.startIndex < this.startIndex) {
				this.startIndex = childSpan.startIndex;
			}

			if (childSpan.endIndex > this.endIndex) {
				// This has never been observed empirically, but here's how we would handle it
				this.endIndex = childSpan.endIndex;
				throw new InternalError('Unexpected AST case');
			}

			if (previousChildSpan && previousChildSpan.endIndex < childSpan.startIndex) {
				// There is some leftover text after previous child -- assign it as the separator for
				// the preceding span.  If the preceding span has no suffix, then assign it to the
				// deepest preceding span with no suffix.  This heuristic simplifies the most
				// common transformations, and otherwise it can be fished out using getLastInnerSeparator().
				let separatorRecipient: Span = previousChildSpan;
				while (separatorRecipient.children.length > 0) {
					const lastChild: Span = separatorRecipient.children[separatorRecipient.children.length - 1]!;
					if (lastChild.endIndex !== separatorRecipient.endIndex) {
						// There is a suffix, so we cannot push the separator any further down, or else
						// it would get printed before this suffix.
						break;
					}

					separatorRecipient = lastChild;
				}

				// @ts-expect-error assigning private readonly properties on creation only
				separatorRecipient._separatorStartIndex = previousChildSpan.endIndex;
				// @ts-expect-error assigning private readonly properties on creation only
				separatorRecipient._separatorEndIndex = childSpan.startIndex;
			}

			previousChildSpan = childSpan;
		}
	}

	public get kind(): ts.SyntaxKind {
		return this.node.kind;
	}

	/**
	 * The parent Span, if any.
	 * NOTE: This will be undefined for a root Span, even though the corresponding Node
	 * may have a parent in the AST.
	 */
	public get parent(): Span | undefined {
		return this._parent;
	}

	/**
	 * If the current object is this.parent.children[i], then previousSibling corresponds
	 * to this.parent.children[i-1] if it exists.
	 * NOTE: This will be undefined for a root Span, even though the corresponding Node
	 * may have a previous sibling in the AST.
	 */
	public get previousSibling(): Span | undefined {
		return this._previousSibling;
	}

	/**
	 * If the current object is this.parent.children[i], then previousSibling corresponds
	 * to this.parent.children[i+1] if it exists.
	 * NOTE: This will be undefined for a root Span, even though the corresponding Node
	 * may have a previous sibling in the AST.
	 */
	public get nextSibling(): Span | undefined {
		return this._nextSibling;
	}

	/**
	 * The text associated with the underlying Node, up to its first child.
	 */
	public get prefix(): string {
		if (this.children.length) {
			// Everything up to the first child
			return this._getSubstring(this.startIndex, this.children[0]!.startIndex);
		} else {
			return this._getSubstring(this.startIndex, this.endIndex);
		}
	}

	/**
	 * The text associated with the underlying Node, after its last child.
	 * If there are no children, this is always an empty string.
	 */
	public get suffix(): string {
		if (this.children.length) {
			// Everything after the last child
			return this._getSubstring(this.children[this.children.length - 1]!.endIndex, this.endIndex);
		} else {
			return '';
		}
	}

	/**
	 * Whitespace that appeared after this node, and before the "next" node in the tree.
	 * Here we mean "next" according to an inorder traversal, not necessarily a sibling.
	 */
	public get separator(): string {
		return this._getSubstring(this._separatorStartIndex, this._separatorEndIndex);
	}

	/**
	 * Returns the separator of this Span, or else recursively calls getLastInnerSeparator()
	 * on the last child.
	 */
	public getLastInnerSeparator(): string {
		if (this.separator) {
			return this.separator;
		}

		if (this.children.length > 0) {
			return this.children[this.children.length - 1]!.getLastInnerSeparator();
		}

		return '';
	}

	/**
	 * Returns the first parent node with the specified  SyntaxKind, or undefined if there is no match.
	 */
	public findFirstParent(kindToMatch: ts.SyntaxKind): Span | undefined {
		let current: Span | undefined = this;

		while (current) {
			if (current.kind === kindToMatch) {
				return current;
			}

			current = current.parent;
		}

		return undefined;
	}

	/**
	 * Recursively invokes the callback on this Span and all its children.  The callback
	 * can make changes to Span.modification for each node.
	 */
	public forEach(callback: (span: Span) => void): void {
		// eslint-disable-next-line n/callback-return
		callback(this);
		for (const child of this.children) {
			// eslint-disable-next-line unicorn/no-array-for-each
			child.forEach(callback);
		}
	}

	/**
	 * Returns the original unmodified text represented by this Span.
	 */
	public getText(): string {
		let result = '';
		result += this.prefix;

		for (const child of this.children) {
			result += child.getText();
		}

		result += this.suffix;
		result += this.separator;

		return result;
	}

	/**
	 * Returns the text represented by this Span, after applying all requested modifications.
	 */
	public getModifiedText(): string {
		const writer: IndentedWriter = new IndentedWriter();
		writer.trimLeadingSpaces = true;

		this._writeModifiedText({
			writer,
			separatorOverride: undefined,
			indentDocCommentState: IndentDocCommentState.Inactive,
		});

		return writer.getText();
	}

	public writeModifiedText(output: IndentedWriter): void {
		this._writeModifiedText({
			writer: output,
			separatorOverride: undefined,
			indentDocCommentState: IndentDocCommentState.Inactive,
		});
	}

	/**
	 * Returns a diagnostic dump of the tree, showing the prefix/suffix/separator for
	 * each node.
	 */
	public getDump(indent: string = ''): string {
		let result: string = indent + ts.SyntaxKind[this.node.kind] + ': ';

		if (this.prefix) {
			result += ' pre=[' + this._getTrimmed(this.prefix) + ']';
		}

		if (this.suffix) {
			result += ' suf=[' + this._getTrimmed(this.suffix) + ']';
		}

		if (this.separator) {
			result += ' sep=[' + this._getTrimmed(this.separator) + ']';
		}

		result += '\n';

		for (const child of this.children) {
			result += child.getDump(indent + '  ');
		}

		return result;
	}

	/**
	 * Returns a diagnostic dump of the tree, showing the SpanModification settings for each nodde.
	 */
	public getModifiedDump(indent: string = ''): string {
		let result: string = indent + ts.SyntaxKind[this.node.kind] + ': ';

		if (this.prefix) {
			result += ' pre=[' + this._getTrimmed(this.modification.prefix) + ']';
		}

		if (this.suffix) {
			result += ' suf=[' + this._getTrimmed(this.modification.suffix) + ']';
		}

		if (this.separator) {
			result += ' sep=[' + this._getTrimmed(this.separator) + ']';
		}

		if (this.modification.indentDocComment !== IndentDocCommentScope.None) {
			result += ' indentDocComment=' + IndentDocCommentScope[this.modification.indentDocComment];
		}

		if (this.modification.omitChildren) {
			result += ' omitChildren';
		}

		if (this.modification.omitSeparatorAfter) {
			result += ' omitSeparatorAfter';
		}

		if (this.modification.sortChildren) {
			result += ' sortChildren';
		}

		if (this.modification.sortKey !== undefined) {
			result += ` sortKey="${this.modification.sortKey}"`;
		}

		result += '\n';

		if (this.modification.omitChildren) {
			result += `${indent}  (${this.children.length} children)\n`;
		} else {
			for (const child of this.children) {
				result += child.getModifiedDump(indent + '  ');
			}
		}

		return result;
	}

	/**
	 * Recursive implementation of `getModifiedText()` and `writeModifiedText()`.
	 */
	private _writeModifiedText(options: IWriteModifiedTextOptions): void {
		// Apply indentation based on "{" and "}"
		if (this.prefix === '{') {
			options.writer.increaseIndent();
		} else if (this.prefix === '}') {
			options.writer.decreaseIndent();
		}

		if (this.modification.indentDocComment !== IndentDocCommentScope.None) {
			this._beginIndentDocComment(options);
		}

		this._write(this.modification.prefix, options);

		if (this.modification.indentDocComment === IndentDocCommentScope.PrefixOnly) {
			this._endIndentDocComment(options);
		}

		let sortedSubset: Span[] | undefined;

		if (!this.modification.omitChildren && this.modification.sortChildren) {
			// We will only sort the items with a sortKey
			const filtered: Span[] = this.children.filter((x) => x.modification.sortKey !== undefined);

			// Is there at least one of them?
			if (filtered.length > 1) {
				sortedSubset = filtered;
			}
		}

		if (sortedSubset) {
			// This is the complicated special case that sorts an arbitrary subset of the child nodes,
			// preserving the surrounding nodes.

			const sortedSubsetCount: number = sortedSubset.length;
			// Remember the separator for the first and last ones
			const firstSeparator: string = sortedSubset[0]!.getLastInnerSeparator();
			const lastSeparator: string = sortedSubset[sortedSubsetCount - 1]!.getLastInnerSeparator();

			Sort.sortBy(sortedSubset, (x) => x.modification.sortKey);

			const childOptions: IWriteModifiedTextOptions = { ...options };

			let sortedSubsetIndex = 0;
			// eslint-disable-next-line @typescript-eslint/prefer-for-of
			for (let index = 0; index < this.children.length; ++index) {
				let current: Span;

				// Is this an item that we sorted?
				if (this.children[index]!.modification.sortKey === undefined) {
					// No, take the next item from the original array
					current = this.children[index]!;
					childOptions.separatorOverride = undefined;
				} else {
					// Yes, take the next item from the sortedSubset
					current = sortedSubset[sortedSubsetIndex++]!;

					if (sortedSubsetIndex < sortedSubsetCount) {
						childOptions.separatorOverride = firstSeparator;
					} else {
						childOptions.separatorOverride = lastSeparator;
					}
				}

				current._writeModifiedText(childOptions);
			}
		} else {
			// This is the normal case that does not need to sort children
			const childrenLength: number = this.children.length;

			if (!this.modification.omitChildren) {
				if (options.separatorOverride === undefined) {
					// The normal simple case
					for (const child of this.children) {
						child._writeModifiedText(options);
					}
				} else {
					// Special case where the separatorOverride is passed down to the "last inner separator" span
					for (let index = 0; index < childrenLength; ++index) {
						const child: Span = this.children[index]!;

						if (
							// Only the last child inherits the separatorOverride, because only it can contain
							// the "last inner separator" span
							index < childrenLength - 1 ||
							// If this.separator is specified, then we will write separatorOverride below, so don't pass it along
							this.separator
						) {
							const childOptions: IWriteModifiedTextOptions = { ...options };
							childOptions.separatorOverride = undefined;
							child._writeModifiedText(childOptions);
						} else {
							child._writeModifiedText(options);
						}
					}
				}
			}

			this._write(this.modification.suffix, options);

			if (options.separatorOverride !== undefined) {
				if (this.separator || childrenLength === 0) {
					this._write(options.separatorOverride, options);
				}
			} else if (!this.modification.omitSeparatorAfter) {
				this._write(this.separator, options);
			}
		}

		if (this.modification.indentDocComment === IndentDocCommentScope.SpanAndChildren) {
			this._endIndentDocComment(options);
		}
	}

	private _beginIndentDocComment(options: IWriteModifiedTextOptions): void {
		if (options.indentDocCommentState !== IndentDocCommentState.Inactive) {
			throw new InternalError('indentDocComment cannot be nested');
		}

		options.indentDocCommentState = IndentDocCommentState.AwaitingOpenDelimiter;
	}

	private _endIndentDocComment(options: IWriteModifiedTextOptions): void {
		if (options.indentDocCommentState === IndentDocCommentState.AwaitingCloseDelimiter) {
			throw new InternalError('missing "*/" delimiter for comment block');
		}

		options.indentDocCommentState = IndentDocCommentState.Inactive;
	}

	/**
	 * Writes one chunk of `text` to the `options.writer`, applying the `indentDocComment` rewriting.
	 */
	private _write(text: string, options: IWriteModifiedTextOptions): void {
		let parsedText: string = text;

		if (options.indentDocCommentState === IndentDocCommentState.AwaitingOpenDelimiter) {
			let index: number = parsedText.indexOf('/*');
			if (index >= 0) {
				index += '/*'.length;
				options.writer.write(parsedText.slice(0, Math.max(0, index)));
				parsedText = parsedText.slice(Math.max(0, index));
				options.indentDocCommentState = IndentDocCommentState.AwaitingCloseDelimiter;

				options.writer.increaseIndent(' ');
			}
		}

		if (options.indentDocCommentState === IndentDocCommentState.AwaitingCloseDelimiter) {
			let index: number = parsedText.indexOf('*/');
			if (index >= 0) {
				index += '*/'.length;
				options.writer.write(parsedText.slice(0, Math.max(0, index)));
				parsedText = parsedText.slice(Math.max(0, index));
				options.indentDocCommentState = IndentDocCommentState.Done;

				options.writer.decreaseIndent();
			}
		}

		options.writer.write(parsedText);
	}

	private _getTrimmed(text: string): string {
		return Text.truncateWithEllipsis(Text.convertToLf(text), 100);
	}

	private _getSubstring(startIndex: number, endIndex: number): string {
		if (startIndex === endIndex) {
			return '';
		}

		return this.node.getSourceFile().text.slice(startIndex, endIndex);
	}
}
