'use server';

import type { ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { SectionShell } from './SectionShell';
import { PropertyList } from '~/components/PropertyList';

export function PropertiesSection({ item, version }: { item: ApiItemContainerMixin; version: string }) {
	return (
		<SectionShell icon={<VscSymbolProperty size={20} />} title="Properties">
			<PropertyList item={item} version={version} />
		</SectionShell>
	);
}
