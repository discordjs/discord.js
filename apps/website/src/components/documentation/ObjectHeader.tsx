import type { ApiDeclaredItem } from '@discordjs/api-extractor-model';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { Header } from './Header';
import { SummarySection } from './section/SummarySection';

export interface ObjectHeaderProps {
	readonly item: ApiDeclaredItem;
}

export function ObjectHeader({ item }: ObjectHeaderProps) {
	return (
		<>
			<Header
				kind={item.kind}
				name={item.displayName}
				sourceURL={item.sourceLocation.fileUrl}
				sourceLine={item.sourceLocation.fileLine}
			/>
			{/* @ts-expect-error async component */}
			<SyntaxHighlighter code={item.excerpt.text} />
			<SummarySection item={item} />
		</>
	);
}
