'use server';

import type { ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { SectionShell } from './SectionShell';
import { PropertyList } from '~/components/PropertyList';

export function PropertiesSection({ item }: { item: ApiItemContainerMixin }) {
	return (
		<SectionShell icon={<VscSymbolProperty size={20} />} title="Properties">
			<PropertyList item={item} />
		</SectionShell>
	);
}
