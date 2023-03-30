import type { ApiDeclaredItem } from '@microsoft/api-extractor-model';
import { VscListSelection } from '@react-icons/all-files/vsc/VscListSelection';
import { TSDoc } from '../tsdoc/TSDoc';
import { DocumentationSection } from './DocumentationSection';

export function SummarySection({ item }: { item: ApiDeclaredItem }) {
	return (
		<DocumentationSection icon={<VscListSelection size={20} />} padded separator title="Summary">
			{item.tsdocComment?.summarySection ? (
				<TSDoc item={item} tsdoc={item.tsdocComment} />
			) : (
				<p>No summary provided.</p>
			)}
		</DocumentationSection>
	);
}
