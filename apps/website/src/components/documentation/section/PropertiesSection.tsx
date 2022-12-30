'use server';

import type { ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { SectionShell } from './SectionShell';
import { PropertyList } from '~/components/PropertyList';

export function PropertiesSection({ item }: { item: ApiItemContainerMixin }) {
	return (
		<SectionShell title="Properties">
			<PropertyList item={item} />
		</SectionShell>
	);
}
