import { ExcerptTokenKind, type ApiTypeAlias, ExcerptToken } from '@discordjs/api-extractor-model';
import { useMemo } from 'react';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { Documentation } from '../documentation/Documentation';
import { Header } from '../documentation/Header';
import { SummarySection } from '../documentation/section/SummarySection';
import { UnionMembersSection } from '../documentation/section/UnionMembersSection';

export function TypeAlias({ item }: { readonly item: ApiTypeAlias }) {
	const union = useMemo(() => {
		const union: ExcerptToken[][] = [];
		let currentUnionMember: ExcerptToken[] = [];
		let depth = 0;
		for (const token of item.typeExcerpt.spannedTokens) {
			if (token.text.includes('?')) {
				return [];
			}

			if (token.text.includes('<')) {
				depth++;
			}

			if (token.text.includes('>')) {
				depth--;
			}

			if (token.text.trim() === '|' && depth === 0) {
				if (currentUnionMember.length) {
					union.push(currentUnionMember);
					currentUnionMember = [];
				}
			} else if (depth === 0 && token.kind === ExcerptTokenKind.Content && token.text.includes('|')) {
				for (const [idx, tokenpart] of token.text.split('|').entries()) {
					if (currentUnionMember.length && depth === 0 && idx === 0) {
						currentUnionMember.push(new ExcerptToken(ExcerptTokenKind.Content, tokenpart));
						union.push(currentUnionMember);
						currentUnionMember = [];
					} else if (currentUnionMember.length && depth === 0) {
						union.push(currentUnionMember);
						currentUnionMember = [new ExcerptToken(ExcerptTokenKind.Content, tokenpart)];
					} else if (tokenpart.length) {
						currentUnionMember.push(new ExcerptToken(ExcerptTokenKind.Content, tokenpart));
					}
				}
			} else {
				currentUnionMember.push(token);
			}
		}

		if (currentUnionMember.length && union.length) {
			union.push(currentUnionMember);
		}

		return union;
	}, [item]);

	return (
		<Documentation>
			<Header
				kind={item.kind}
				name={item.displayName}
				sourceURL={item.sourceLocation.fileUrl}
				sourceLine={item.sourceLocation.fileLine}
			/>
			{/* @ts-expect-error async component */}
			<SyntaxHighlighter code={item.excerpt.text} />
			<SummarySection item={item} />
			{union.length ? <UnionMembersSection item={item} members={union} /> : null}
		</Documentation>
	);
}
