import type { ApiDeclaredItem } from '@microsoft/api-extractor-model';
import { VscListSelection } from '@react-icons/all-files/vsc/VscListSelection';
import { TSDoc } from '../tsdoc/TSDoc';
import { ResponsiveSection } from './ResponsiveSection';

export function SummarySection({ item }: { item: ApiDeclaredItem }) {
	return (
		<ResponsiveSection icon={<VscListSelection size={20} />} padded separator title="Summary">
			{item.tsdocComment?.summarySection ? (
				<TSDoc item={item} tsdoc={item.tsdocComment.summarySection} />
			) : (
				<p>No summary provided.</p>
			)}
		</ResponsiveSection>
	);
}
