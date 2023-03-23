import type { ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { DocumentationSection } from './DocumentationSection';
import { PropertyList } from '~/components/PropertyList';

export function PropertiesSection({ item }: { item: ApiItemContainerMixin }) {
	return (
		<DocumentationSection icon={<VscSymbolProperty size={20} />} padded title="Properties">
			<PropertyList item={item} />
		</DocumentationSection>
	);
}
