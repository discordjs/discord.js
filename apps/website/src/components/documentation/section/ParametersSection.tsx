import type { ApiParameterListMixin } from '@microsoft/api-extractor-model';
import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { DocumentationSection } from './DocumentationSection';
import { ParameterTable } from '~/components/ParameterTable';

export function ParameterSection({ item }: { item: ApiParameterListMixin }) {
	return (
		<DocumentationSection icon={<VscSymbolParameter size={20} />} padded title="Parameters">
			<ParameterTable item={item} />
		</DocumentationSection>
	);
}
