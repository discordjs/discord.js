import type { TokenDocumentation } from '@discordjs/api-extractor-utils';
import { Anchor, Text } from '@mantine/core';
import Link from 'next/link';

/**
 * Constructs a hyperlinked html node based on token type references
 *
 * @param tokens An array of documentation tokens to construct the HTML
 *
 * @returns An array of JSX elements and string comprising the hyperlinked text
 */
export function HyperlinkedText({ tokens }: { tokens: TokenDocumentation[] }) {
	return (
		<>
			{tokens.map((token, idx) => {
				if (token.path) {
					return (
						<Link key={idx} href={token.path} passHref prefetch={false}>
							<Anchor component="a" inherit>
								{token.text}
							</Anchor>
						</Link>
					);
				}

				return (
					<Text key={idx} span unstyled>
						{token.text}
					</Text>
				);
			})}
		</>
	);
}
