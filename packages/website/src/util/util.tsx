import type { TokenDocumentation } from './parse.server';

/**
 * Constructs a hyperlinked html node based on token type references
 *
 * @param tokens An array of documentation tokens to construct the HTML
 *
 * @returns An array of JSX elements and string comprising the hyperlinked text
 */
export function constructHyperlinkedText(tokens: TokenDocumentation[]) {
	const html: (JSX.Element | string)[] = [];

	for (const token of tokens) {
		if (token.path) {
			html.push(<a href={token.path}>{token.text}</a>);
			continue;
		}

		html.push(token.text);
	}

	return html;
}
