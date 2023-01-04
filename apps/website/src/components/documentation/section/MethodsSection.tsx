'use server';

import type { ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { SectionShell } from './SectionShell';
import { MethodList } from '~/components/MethodList';

export function MethodsSection({ item, version }: { item: ApiItemContainerMixin; version: string }) {
	return (
		<SectionShell icon={<VscSymbolMethod size={20} />} padded title="Methods">
			<MethodList item={item} version={version} />
		</SectionShell>
	);
}
