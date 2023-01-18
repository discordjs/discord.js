/* eslint-disable prefer-named-capture-group */

export interface EscapeMarkdownOptions {
	/**
	 * Whether to escape bolds
	 *
	 * @defaultValue true
	 */
	bold?: boolean;

	/**
	 * Whether to escape bulleted lists
	 *
	 * @defaultValue false
	 */
	bulletedList?: boolean;

	/**
	 * Whether to escape code blocks
	 *
	 * @defaultValue true
	 */
	codeBlock?: boolean;

	/**
	 * Whether to escape text inside code blocks
	 *
	 * @defaultValue true
	 */
	codeBlockContent?: boolean;

	/**
	 * Whether to escape escape characters
	 *
	 * @defaultValue true
	 */
	escape?: boolean;

	/**
	 * Whether to escape headings
	 *
	 * @defaultValue false
	 */
	heading?: boolean;

	/**
	 * Whether to escape inline code
	 *
	 * @defaultValue true
	 */
	inlineCode?: boolean;

	/**
	 * Whether to escape text inside inline code
	 *
	 * @defaultValue true
	 */
	inlineCodeContent?: boolean;
	/**
	 * Whether to escape italics
	 *
	 * @defaultValue true
	 */
	italic?: boolean;

	/**
	 * Whether to escape masked links
	 *
	 * @defaultValue false
	 */
	maskedLink?: boolean;

	/**
	 * Whether to escape numbered lists
	 *
	 * @defaultValue false
	 */
	numberedList?: boolean;

	/**
	 * Whether to escape spoilers
	 *
	 * @defaultValue true
	 */
	spoiler?: boolean;

	/**
	 * Whether to escape strikethroughs
	 *
	 * @defaultValue true
	 */
	strikethrough?: boolean;

	/**
	 * Whether to escape underlines
	 *
	 * @defaultValue true
	 */
	underline?: boolean;
}

/**
 * Escapes any Discord-flavour markdown in a string.
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
		heading = false,
		bulletedList = false,
		numberedList = false,
		maskedLink = false,
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
 * @param text - Content to escape
 */
export function escapeItalic(text: string): string {
	let idx = 0;
	const newText = text.replaceAll(/(?<=^|[^*])\*([^*]|\*\*|$)/g, (_, match) => {
		if (match === '**') return ++idx % 2 ? `\\*${match}` : `${match}\\*`;
		return `\\*${match}`;
	});
	idx = 0;
	return newText.replaceAll(/(?<=^|[^_])(?<!<a?:.+)_(?!:\d+>)([^_]|__|$)/g, (_, match) => {
		if (match === '__') return ++idx % 2 ? `\\_${match}` : `${match}\\_`;
		return `\\_${match}`;
	});
}

/**
 * Escapes bold markdown in a string.
 *
 * @param text - Content to escape
 */
export function escapeBold(text: string): string {
	let idx = 0;
	return text.replaceAll(/\*\*(\*)?/g, (_, match) => {
		if (match) return ++idx % 2 ? `${match}\\*\\*` : `\\*\\*${match}`;
		return '\\*\\*';
	});
}

/**
 * Escapes underline markdown in a string.
 *
 * @param text - Content to escape
 */
export function escapeUnderline(text: string): string {
	let idx = 0;
	return text.replaceAll(/(?<!<a?:.+)__(_)?(?!:\d+>)/g, (_, match) => {
		if (match) return ++idx % 2 ? `${match}\\_\\_` : `\\_\\_${match}`;
		return '\\_\\_';
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
