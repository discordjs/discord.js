import type { ApiTypeAlias } from '@microsoft/api-extractor-model';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { Documentation } from '../documentation/Documentation';
import { SummarySection } from '../documentation/section/SummarySection';

export function TypeAlias({ item }: { item: ApiTypeAlias }) {
	return (
		<Documentation item={item}>
			<SyntaxHighlighter code={item.excerpt.text} />
			<SummarySection item={item} />
		</Documentation>
	);
}
