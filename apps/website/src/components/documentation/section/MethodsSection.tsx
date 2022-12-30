'use server';

import type { ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { SectionShell } from './SectionShell';
import { MethodList } from '~/components/MethodList';

export function MethodsSection({ item }: { item: ApiItemContainerMixin }) {
	return (
		<SectionShell title="Methods">
			<MethodList item={item} />
		</SectionShell>
	);
}
