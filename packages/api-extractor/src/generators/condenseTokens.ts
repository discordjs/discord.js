// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { ExcerptTokenKind, type IExcerptToken, type IExcerptTokenRange } from '@discordjs/api-extractor-model';

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
export function condenseTokens(excerptTokens: IExcerptToken[], tokenRanges: IExcerptTokenRange[]): void {
	const originalTokenCount: number = excerptTokens.length;

	// A token that sits at the start or end index of any token range must be preserved (never merged
	// away), so that every range can be accurately remapped after condensing. These indices refer to
	// the original positions in `excerptTokens`, and since preserved tokens are never removed, this
	// set never needs to be rebuilt.
	const preservedIndices: Set<number> = new Set();
	for (const tokenRange of tokenRanges) {
		preservedIndices.add(tokenRange.startIndex);
		preservedIndices.add(tokenRange.endIndex);
	}

	// Build the condensed token list in a single forward pass, treating it as a stack so that a
	// token merged into its predecessor can itself be merged into a further predecessor (e.g. a
	// chain of reference tokens such as "A" "." "B" "." "C").
	//
	// `newIndexByOriginalIndex` maps each kept token's original index to its index in the condensed
	// list, which is then used to remap the token ranges. Every range boundary refers to a preserved
	// token (or, for an exclusive `endIndex`, the token count), and preserved tokens are never merged
	// away, so a direct lookup always resolves. It is sized `originalTokenCount + 1` to hold the
	// mapping for an `endIndex` equal to the token count.
	const condensedTokens: IExcerptToken[] = [];
	const newIndexByOriginalIndex: Int32Array = new Int32Array(originalTokenCount + 1);

	// Whether the token currently on top of the stack is preserved. Only consulted when that token is
	// the "." of a reference merge; because a "." only ever becomes the top via a push (content tokens
	// are always separated by references, so a "." is never uncovered by a pop), this scalar is always
	// up to date at the point it is read, avoiding a parallel array of original indices.
	let prevTokenIsPreserved = false;

	for (let currentIndex = 0; currentIndex < originalTokenCount; ++currentIndex) {
		const currentToken: IExcerptToken = excerptTokens[currentIndex]!;
		const currentIsPreserved: boolean = preservedIndices.has(currentIndex);
		const condensedCount: number = condensedTokens.length;

		// A preserved token must never be merged away, so merges are only attempted when the current
		// token is not preserved. There are two types of merges that can occur, and both consume the
		// current token. Reads of the top two stack entries are guarded so they never index out of
		// bounds.
		let merged = false;
		if (!currentIsPreserved && condensedCount >= 1) {
			const prevToken: IExcerptToken = condensedTokens[condensedCount - 1]!;

			if (
				condensedCount >= 2 &&
				currentToken.kind === ExcerptTokenKind.Reference &&
				prevToken.kind === ExcerptTokenKind.Content &&
				prevToken.text.trim() === '.' &&
				!prevTokenIsPreserved &&
				condensedTokens[condensedCount - 2]!.kind === ExcerptTokenKind.Reference
			) {
				// If the current token is a reference token, the previous token is a ".", and the previous-
				// previous token is a reference token, then merge all three tokens into a reference token.
				//
				// For example: Given ["MyNamespace" (R), ".", "MyClass" (R)], tokens "." and "MyClass" might
				// be merged into "MyNamespace". The condensed token would be ["MyNamespace.MyClass" (R)].
				const prevPrevToken: IExcerptToken = condensedTokens[condensedCount - 2]!;
				prevPrevToken.text += prevToken.text + currentToken.text;
				prevPrevToken.canonicalReference = currentToken.canonicalReference;

				// The "." token (already kept) and the current token are both merged into prevPrevToken.
				condensedTokens.pop();
				merged = true;
			} else if (
				// If the current and previous tokens are both content tokens, then merge the tokens into a
				// single content token. For example: Given ["export ", "declare class"], these tokens
				// might be merged into "export declare class".
				prevToken.kind === ExcerptTokenKind.Content &&
				currentToken.kind === ExcerptTokenKind.Content
			) {
				prevToken.text += currentToken.text;
				merged = true;
			}
		}

		if (!merged) {
			// No merging occurred, so keep the current token, record its new index, and update the
			// preservation flag to reflect the new top of the stack.
			newIndexByOriginalIndex[currentIndex] = condensedTokens.length;
			condensedTokens.push(currentToken);
			prevTokenIsPreserved = currentIsPreserved;
		}
	}

	// Remap the token ranges directly. Each boundary is a preserved token's original index (or the
	// token count, for an exclusive `endIndex`), which maps straight to its position in the condensed
	// list. `endIndex` is clamped because it may equal the token count.
	newIndexByOriginalIndex[originalTokenCount] = condensedTokens.length;
	for (const tokenRange of tokenRanges) {
		tokenRange.startIndex = newIndexByOriginalIndex[Math.min(tokenRange.startIndex, originalTokenCount)]!;
		tokenRange.endIndex = newIndexByOriginalIndex[Math.min(tokenRange.endIndex, originalTokenCount)]!;
	}

	// Replace the excerpt tokens in place with the condensed list.
	excerptTokens.length = 0;
	for (const token of condensedTokens) {
		excerptTokens.push(token);
	}
}
