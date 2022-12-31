import type { ApiDeclaredItem } from '@microsoft/api-extractor-model';
import { VscListSelection } from '@react-icons/all-files/vsc/VscListSelection';
import { TSDoc } from '../tsdoc/TSDoc';
import { SectionShell } from './SectionShell';

export function SummarySection({ item }: { item: ApiDeclaredItem }) {
	return (
		<SectionShell icon={<VscListSelection size={20} />} title="Summary">
			{item.tsdocComment?.summarySection ? (
				<TSDoc item={item} tsdoc={item.tsdocComment.summarySection} />
			) : (
				<p>No summary provided.</p>
			)}
		</SectionShell>
	);
}
