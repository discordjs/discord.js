import type { ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { ResponsiveSection } from './ResponsiveSection';
import { PropertyList } from '~/components/PropertyList';

export function PropertiesSection({ item }: { item: ApiItemContainerMixin }) {
	return (
		<ResponsiveSection icon={<VscSymbolProperty size={20} />} padded title="Properties">
			<PropertyList item={item} />
		</ResponsiveSection>
	);
}
