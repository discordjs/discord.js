'use server';

import type { ApiItemContainerMixin } from '@microsoft/api-extractor-model';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { ResponsiveSection } from './ResponsiveSection';
import { MethodList } from '~/components/MethodList';

export function MethodsSection({ item }: { item: ApiItemContainerMixin }) {
	return (
		<ResponsiveSection icon={<VscSymbolMethod size={20} />} padded title="Methods">
			<MethodList item={item} />
		</ResponsiveSection>
	);
}
