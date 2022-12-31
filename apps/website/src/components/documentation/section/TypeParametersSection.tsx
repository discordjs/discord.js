'use server';

import type { ApiTypeParameterListMixin } from '@microsoft/api-extractor-model';
import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { SectionShell } from './SectionShell';
import { TypeParamTable } from '~/components/TypeParamTable';

export function TypeParameterSection({ item }: { item: ApiTypeParameterListMixin }) {
	return (
		<SectionShell icon={<VscSymbolParameter size={20} />} title="Type Parameters">
			<TypeParamTable item={item} />
		</SectionShell>
	);
}
