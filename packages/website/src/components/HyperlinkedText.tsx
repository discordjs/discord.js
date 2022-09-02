import type { TokenDocumentation } from '@discordjs/api-extractor-utils';
import { Anchor, Text } from '@mantine/core';
import Link from 'next/link';

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
