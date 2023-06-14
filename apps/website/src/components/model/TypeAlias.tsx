import type { ApiTypeAlias } from '@microsoft/api-extractor-model';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { Documentation } from '../documentation/Documentation';
import { Header } from '../documentation/Header';
import { SummarySection } from '../documentation/section/SummarySection';

export function TypeAlias({ item }: { item: ApiTypeAlias }) {
	return (
		<Documentation>
			<Header kind={item.kind} name={item.displayName} sourceURL={item.sourceLocation.fileUrl} />
			{/* @ts-expect-error async component */}
			<SyntaxHighlighter code={item.excerpt.text} />
			<SummarySection item={item} />
		</Documentation>
	);
}
