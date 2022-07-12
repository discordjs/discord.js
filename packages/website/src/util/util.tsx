import type { TokenDocumentation } from './parse.server';

export interface HyperlinkedTextProps {
	tokens: TokenDocumentation[],
}

/**
 * Constructs a hyperlinked html node based on token type references
 *
 * @param tokens An array of documentation tokens to construct the HTML
 *
 * @returns An array of JSX elements and string comprising the hyperlinked text
 */
export function HyperlinkedText({ tokens }: HyperlinkedTextProps) {
	return (
		<>
			{tokens.map(token => {
				if (token.path) {
					return <a key={token.text} href={token.path}>{token.text}</a>
				}

				return token.text
			})}
		</>
	)
}
