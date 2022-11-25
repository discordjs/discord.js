import type { TokenDocumentation } from '@discordjs/api-extractor-utils';
import Link from 'next/link';

export function HyperlinkedText({ tokens }: { tokens: TokenDocumentation[] }) {
	return (
		<>
			{tokens.map((token, idx) => {
				if (token.path) {
					return (
						<Link
							className="text-blurple focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
							href={token.path}
							key={idx}
							prefetch={false}
						>
							{token.text}
						</Link>
					);
				}

				return <span key={idx}>{token.text}</span>;
			})}
		</>
	);
}
