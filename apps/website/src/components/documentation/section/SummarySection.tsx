import type { ApiDocumentedItem } from '@microsoft/api-extractor-model';
import { TSDoc } from '../tsdoc/TSDoc';
import { SectionShell } from './SectionShell';

export function SummarySection({ item }: { item: ApiDocumentedItem }) {
	return item.tsdocComment ? (
		<SectionShell>
			<TSDoc item={item} tsdoc={item.tsdocComment?.summarySection} />
		</SectionShell>
	) : null;
}
