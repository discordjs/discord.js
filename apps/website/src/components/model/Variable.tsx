import type { ApiVariable } from '@microsoft/api-extractor-model';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { Documentation } from '../documentation/Documentation';
import { SummarySection } from '../documentation/section/SummarySection';

export function Variable({ item }: { item: ApiVariable }) {
	return (
		<Documentation item={item}>
			<SyntaxHighlighter code={item.excerpt.text} />
			<SummarySection item={item} />
		</Documentation>
	);
}
