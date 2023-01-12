import type { ApiDeclaredItem, ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { Header } from './Header';
import { SummarySection } from './section/SummarySection';

export interface ObjectHeaderProps {
	item: ApiDeclaredItem & ApiItemContainerMixin;
}

export function ObjectHeader({ item }: ObjectHeaderProps) {
	return (
		<>
			<Header kind={item.kind} name={item.displayName} sourceURL={item.sourceLocation.fileUrl} />
			<SyntaxHighlighter code={item.excerpt.text} />
			<SummarySection item={item} />
		</>
	);
}
