'use server';

import type { ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { SectionShell } from './SectionShell';
import { MethodList } from '~/components/MethodList';

export function MethodsSection({ item }: { item: ApiItemContainerMixin }) {
	return (
		<SectionShell icon={<VscSymbolMethod size={20} />} title="Methods">
			<MethodList item={item} />
		</SectionShell>
	);
}
