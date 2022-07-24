import Link from 'next/link';
import type { TokenDocumentation } from '~/util/parse.server';

export interface HyperlinkedTextProps {
	tokens: TokenDocumentation[];
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
			{tokens.map((token) => {
				if (token.path) {
					return (
						<Link key={token.text} href={token.path}>
							{token.text}
						</Link>
					);
				}

				return token.text;
			})}
		</>
	);
}
