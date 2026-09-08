/* eslint-disable prefer-named-capture-group */

/**
 * The options that affect what will be escaped.
 */
export interface EscapeMarkdownOptions {
	/**
	 * Whether to escape block quotes.
	 *
	 * @defaultValue `true`
	 */
	blockQuote?: boolean;

	/**
	 * Whether to escape bold text.
	 *
	 * @defaultValue `true`
	 */
	bold?: boolean;

	/**
	 * Whether to escape bulleted lists.
	 *
	 * @defaultValue `true`
	 */
	bulletedList?: boolean;

	/**
	 * Whether to escape code blocks.
	 *
	 * @defaultValue `true`
	 */
	codeBlock?: boolean;

	/**
	 * Whether to escape text inside code blocks.
	 *
	 * @defaultValue `true`
	 */
	codeBlockContent?: boolean;

	/**
	 * Whether to escape `\`.
	 *
	 * @defaultValue `true`
	 */
	escape?: boolean;

	/**
	 * Whether to escape headings.
	 *
	 * @defaultValue `true`
	 */
	heading?: boolean;

	/**
	 * Whether to escape inline code.
	 *
	 * @defaultValue `true`
	 */
	inlineCode?: boolean;

	/**
	 * Whether to escape text inside inline code.
	 *
	 * @defaultValue `true`
	 */
	inlineCodeContent?: boolean;
	/**
	 * Whether to escape italics.
	 *
	 * @defaultValue `true`
	 */
	italic?: boolean;

	/**
	 * Whether to escape masked links.
	 *
	 * @defaultValue `true`
	 */
	maskedLink?: boolean;

	/**
	 * Whether to escape numbered lists.
	 *
	 * @defaultValue `true`
	 */
	numberedList?: boolean;

	/**
	 * Whether to escape block quotes.
	 *
	 * @defaultValue `true`
	 */
	quote?: boolean;

	/**
	 * Whether to escape spoilers.
	 *
	 * @defaultValue `true`
	 */
	spoiler?: boolean;

	/**
	 * Whether to escape strikethroughs.
	 *
	 * @defaultValue `true`
	 */
	strikethrough?: boolean;

	/**
	 * Whether to escape underlines.
	 *
	 * @defaultValue `true`
	 */
	underline?: boolean;
}

/**
 * Escapes any Discord-flavored markdown in a string.
 *
 * @param text - Content to escape
 * @param options - Options for escaping the markdown
 */
export function escapeMarkdown(text: string, options: EscapeMarkdownOptions = {}): string {
	const {
		codeBlock = true,
		inlineCode = true,
		bold = true,
		italic = true,
		underline = true,
		strikethrough = true,
		spoiler = true,
		codeBlockContent = true,
		inlineCodeContent = true,
		escape = true,
		heading = true,
		bulletedList = true,
		numberedList = true,
		maskedLink = true,
		blockQuote = true,
		quote = true,
	} = options;

	if (!codeBlockContent) {
		return text
			.split('```')
			.map((subString, index, array) => {
				if (index % 2 && index !== array.length - 1) return subString;
				return escapeMarkdown(subString, {
					inlineCode,
					bold,
					italic,
					underline,
					strikethrough,
					spoiler,
					inlineCodeContent,
					escape,
					heading,
					bulletedList,
					numberedList,
					maskedLink,
					blockQuote,
					quote,
				});
			})
			.join(codeBlock ? '\\`\\`\\`' : '```');
	}

	if (!inlineCodeContent) {
		return text
			.split(/(?<=^|[^`])`(?=[^`]|$)/g)
			.map((subString, index, array) => {
				if (index % 2 && index !== array.length - 1) return subString;
				return escapeMarkdown(subString, {
					codeBlock,
					bold,
					italic,
					underline,
					strikethrough,
					spoiler,
					escape,
					heading,
					bulletedList,
					numberedList,
					maskedLink,
					blockQuote,
					quote,
				});
			})
			.join(inlineCode ? '\\`' : '`');
	}

	let res = text;
	if (escape) res = escapeEscape(res);
	if (inlineCode) res = escapeInlineCode(res);
	if (codeBlock) res = escapeCodeBlock(res);
	if (italic) res = escapeItalic(res);
	if (bold) res = escapeBold(res);
	if (underline) res = escapeUnderline(res);
	if (strikethrough) res = escapeStrikethrough(res);
	if (spoiler) res = escapeSpoiler(res);
	if (heading) res = escapeHeading(res);
	if (bulletedList) res = escapeBulletedList(res);
	if (numberedList) res = escapeNumberedList(res);
	if (maskedLink) res = escapeMaskedLink(res);
	if (quote) res = escapeQuote(res);
	if (blockQuote) res = escapeBlockQuote(res);
	return res;
}

/**
 * Escapes code block markdown in a string.
 *
 * @param text - Content to escape
 */
export function escapeCodeBlock(text: string): string {
	return text.replaceAll('```', '\\`\\`\\`');
}

/**
 * Escapes inline code markdown in a string.
 *
 * @param text - Content to escape
 */
export function escapeInlineCode(text: string): string {
	return text.replaceAll(/(?<=^|[^`])``?(?=[^`]|$)/g, (match) => (match.length === 2 ? '\\`\\`' : '\\`'));
}

/**
 * Escapes italic markdown in a string.
 *
 * A run of `*` or `_` is only "italic" on its own when its length is odd; an even-length
 * run is entirely made up of bold/underline pairs and is left untouched here so
 * {@link escapeBold} / {@link escapeUnderline} can handle it. Operating on the whole run at
 * once (instead of peeking 1-2 characters ahead per match) avoids the overlapping-match bug
 * where `RegExp#lastIndex` skips past unescaped characters in runs of 4 or more markers.
 *
 * @param text - Content to escape
 */
export function escapeItalic(text: string): string {
	let idx = 0;
	const newText = text.replaceAll(/(?<=^|[^*])(?<!(?<!<)https?:\/\/\S*|<[^\s:]+:\/[^\s>]*)\*+/g, (run) => {
		if (run.length % 2 === 0) return run;
		const pairs = '*'.repeat(run.length - 1);
		return ++idx % 2 ? `\\*${pairs}` : `${pairs}\\*`;
	});
	idx = 0;
	return newText.replaceAll(/(?<=^|[^_])(?<!<a?:.+|(?<!<)https?:\/\/\S*|<[^\s:]:\/[^\s>]*)_+(?!_)(?!:\d+>)/g, (run) => {
		if (run.length % 2 === 0) return run;
		const pairs = '_'.repeat(run.length - 1);
		return ++idx % 2 ? `\\_${pairs}` : `${pairs}\\_`;
	});
}

/**
 * Escapes bold markdown in a string.
 *
 * Matches a run of two or more `*` as a whole (instead of `**` plus one optional lookahead
 * character) so runs longer than 3 characters don't leave unescaped trailing asterisks. The
 * `(?<!\\)` guard skips a `*` that {@link escapeItalic} already escaped, so it isn't folded
 * into a new run. When {@link escapeItalic} ran first, the run passed in is always even in
 * length; the odd-length fallback below only matters if `escapeBold` is called on its own.
 *
 * @param text - Content to escape
 */
export function escapeBold(text: string): string {
	let idx = 0;
	return text.replaceAll(/(?<!\\)\*{2,}/g, (run) => {
		const pairs = Math.floor(run.length / 2);
		const leftover = run.length % 2;
		const escaped = '\\*\\*'.repeat(pairs);
		if (!leftover) return escaped;
		return ++idx % 2 ? `*${escaped}` : `${escaped}*`;
	});
}

/**
 * Escapes underline markdown in a string.
 *
 * See {@link escapeBold} for the reasoning behind matching the whole run at once instead of
 * `__` plus one optional lookahead character.
 *
 * @param text - Content to escape
 */
export function escapeUnderline(text: string): string {
	let idx = 0;

	return text.replaceAll(/(?<!\\)(?<!<a?:.+|https?:\/\/\S+)_{2,}(?!_)(?!:\d+>)/g, (run) => {
		const pairs = Math.floor(run.length / 2);
		const leftover = run.length % 2;
		const escaped = '\\_\\_'.repeat(pairs);
		if (!leftover) return escaped;
		return ++idx % 2 ? `_${escaped}` : `${escaped}_`;
	});
}

/**
 * Escapes strikethrough markdown in a string.
 *
 * @param text - Content to escape
 */
export function escapeStrikethrough(text: string): string {
	return text.replaceAll('~~', '\\~\\~');
}

/**
 * Escapes spoiler markdown in a string.
 *
 * @param text - Content to escape
 */
export function escapeSpoiler(text: string): string {
	return text.replaceAll('||', '\\|\\|');
}

/**
 * Escapes escape characters in a string.
 *
 * @param text - Content to escape
 */
export function escapeEscape(text: string): string {
	return text.replaceAll('\\', '\\\\');
}

/**
 * Escapes heading characters in a string.
 *
 * @param text - Content to escape
 */
export function escapeHeading(text: string): string {
	return text.replaceAll(/^( {0,2})([*-] )?( *)(#{1,3} )/gm, '$1$2$3\\$4');
}

/**
 * Escapes bulleted list characters in a string.
 *
 * @param text - Content to escape
 */
export function escapeBulletedList(text: string): string {
	return text.replaceAll(/^( *)([*-])( +)/gm, '$1\\$2$3');
}

/**
 * Escapes numbered list characters in a string.
 *
 * @param text - Content to escape
 */
export function escapeNumberedList(text: string): string {
	return text.replaceAll(/^( *\d+)\./gm, '$1\\.');
}

/**
 * Escapes masked link characters in a string.
 *
 * @param text - Content to escape
 */
export function escapeMaskedLink(text: string): string {
	return text.replaceAll(/\[.+]\(.+\)/gm, '\\$&');
}

/**
 * Escapes quote characters in a string.
 *
 * @param text - Content to escape
 */
export function escapeQuote(text: string): string {
	return text.replaceAll(/^(\s*)>(\s+)/gm, '$1\\>$2');
}

/**
 * Escapes block quote characters in a string.
 *
 * @param text - Content to escape
 */
export function escapeBlockQuote(text: string): string {
	return text.replaceAll(/^(\s*)>>>(\s+)/gm, '$1\\>>>$2');
}
