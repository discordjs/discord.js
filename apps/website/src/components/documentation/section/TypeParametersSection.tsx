import type { ApiTypeParameterListMixin } from '@microsoft/api-extractor-model';
import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { ResponsiveSection } from './ResponsiveSection';
import { TypeParamTable } from '~/components/TypeParamTable';

export function TypeParameterSection({ item }: { item: ApiTypeParameterListMixin }) {
	return (
		<ResponsiveSection icon={<VscSymbolParameter size={20} />} padded title="Type Parameters">
			<TypeParamTable item={item} />
		</ResponsiveSection>
	);
}
