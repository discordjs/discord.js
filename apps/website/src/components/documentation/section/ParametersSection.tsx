import type { ApiParameterListMixin } from '@microsoft/api-extractor-model';
import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { ResponsiveSection } from './ResponsiveSection';
import { ParameterTable } from '~/components/ParameterTable';

export function ParameterSection({ item }: { item: ApiParameterListMixin }) {
	return (
		<ResponsiveSection icon={<VscSymbolParameter size={20} />} padded title="Parameters">
			<ParameterTable item={item} />
		</ResponsiveSection>
	);
}
