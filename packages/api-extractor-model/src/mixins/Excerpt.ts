// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import { Text } from '@rushstack/node-core-library';

/**
 * @public
 */
export enum ExcerptTokenKind {
	/**
	 * Generic text without any special properties
	 */
	Content = 'Content',

	/**
	 * A reference to an API declaration
	 */
	Reference = 'Reference',
}

/**
 * Used by {@link Excerpt} to indicate a range of indexes within an array of `ExcerptToken` objects.
 *
 * @public
 */
export interface IExcerptTokenRange {
	/**
	 * The index of the last member of the span, plus one.
	 *
	 * @remarks
	 *
	 * If `startIndex` and `endIndex` are the same number, then the span is empty.
	 */
	endIndex: number;

	/**
	 * The starting index of the span.
	 */
	startIndex: number;
}

/**
 * @public
 */
export interface IExcerptToken {
	canonicalReference?: string | undefined;
	readonly kind: ExcerptTokenKind;
	text: string;
}

/**
 * Represents a fragment of text belonging to an {@link Excerpt} object.
 *
 * @public
 */
export class ExcerptToken {
	private readonly _kind: ExcerptTokenKind;

	private readonly _text: string;

	private readonly _canonicalReference: DeclarationReference | undefined;

	public constructor(kind: ExcerptTokenKind, text: string, canonicalReference?: DeclarationReference) {
		this._kind = kind;

		// Standardize the newlines across operating systems. Even though this may deviate from the actual
		// input source file that was parsed, it's useful because the newline gets serialized inside
		// a string literal in .api.json, which cannot be automatically normalized by Git.
		this._text = Text.convertToLf(text);
		this._canonicalReference = canonicalReference;
	}

	/**
	 * Indicates the kind of token.
	 */
	public get kind(): ExcerptTokenKind {
		return this._kind;
	}

	/**
	 * The text fragment.
	 */
	public get text(): string {
		return this._text;
	}

	/**
	 * The hyperlink target for a token whose type is `ExcerptTokenKind.Reference`.  For other token types,
	 * this property will be `undefined`.
	 */
	public get canonicalReference(): DeclarationReference | undefined {
		return this._canonicalReference;
	}
}

/**
 * The `Excerpt` class is used by {@link ApiDeclaredItem} to represent a TypeScript code fragment that may be
 * annotated with hyperlinks to declared types (and in the future, source code locations).
 *
 * @remarks
 * API Extractor's .api.json file format stores excerpts compactly as a start/end indexes into an array of tokens.
 * Every `ApiDeclaredItem` has a "main excerpt" corresponding to the full list of tokens.  The declaration may
 * also have have "captured" excerpts that correspond to subranges of tokens.
 *
 * For example, if the main excerpt is:
 *
 * ```
 * function parse(s: string): Vector | undefined;
 * ```
 *
 * ...then this entire signature is the "main excerpt", whereas the function's return type `Vector | undefined` is a
 * captured excerpt.  The `Vector` token might be a hyperlink to that API item.
 *
 * An excerpt may be empty (i.e. a token range containing zero tokens).  For example, if a function's return value
 * is not explicitly declared, then the returnTypeExcerpt will be empty.  By contrast, a class constructor cannot
 * have a return value, so ApiConstructor has no returnTypeExcerpt property at all.
 * @public
 */
export class Excerpt {
	/**
	 * The complete list of tokens for the source code fragment that this excerpt is based upon.
	 * If this object is the main excerpt, then it will span all of the tokens; otherwise, it will correspond to
	 * a range within the array.
	 */
	public readonly tokens: readonly ExcerptToken[];

	/**
	 * Specifies the excerpt's range within the `tokens` array.
	 */
	public readonly tokenRange: Readonly<IExcerptTokenRange>;

	/**
	 * The tokens spanned by this excerpt.  It is the range of the `tokens` array as specified by the `tokenRange`
	 * property.
	 */
	public readonly spannedTokens: readonly ExcerptToken[];

	private _text: string | undefined;

	public constructor(tokens: readonly ExcerptToken[], tokenRange: IExcerptTokenRange) {
		this.tokens = tokens;
		this.tokenRange = tokenRange;

		if (
			this.tokenRange.startIndex < 0 ||
			this.tokenRange.endIndex > this.tokens.length ||
			this.tokenRange.startIndex > this.tokenRange.endIndex
		) {
			throw new Error(
				`Invalid token range. length:${this.tokens.length}, start:${this.tokenRange.startIndex}, end:${
					this.tokenRange.endIndex
				}, ${this.tokens.map((token) => token.text)}`,
			);
		}

		this.spannedTokens = this.tokens.slice(this.tokenRange.startIndex, this.tokenRange.endIndex);
	}

	/**
	 * The excerpted text, formed by concatenating the text of the `spannedTokens` strings.
	 */
	public get text(): string {
		if (this._text === undefined) {
			this._text = this.spannedTokens.map((x) => x.text).join('');
		}

		return this._text;
	}

	/**
	 * Returns true if the excerpt is an empty range.
	 */
	public get isEmpty(): boolean {
		return this.tokenRange.startIndex === this.tokenRange.endIndex;
	}
}
