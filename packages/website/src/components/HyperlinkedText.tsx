import type { TokenDocumentation } from '@discordjs/api-extractor-utils';
import Link from 'next/link';

export function HyperlinkedText({ tokens }: { tokens: TokenDocumentation[] }) {
	return (
		<>
			{tokens.map((token, idx) => {
				if (token.path) {
					return (
						<Link key={idx} href={token.path} prefetch={false}>
							<a className="text-blurple">{token.text}</a>
						</Link>
					);
				}

				return <span key={idx}>{token.text}</span>;
			})}
		</>
	);
}
