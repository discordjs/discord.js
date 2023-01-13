import type { ApiTypeParameterListMixin } from '@microsoft/api-extractor-model';
import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { DocumentationSection } from './DocumentationSection';
import { TypeParamTable } from '~/components/TypeParamTable';

export function TypeParameterSection({ item }: { item: ApiTypeParameterListMixin }) {
	return (
		<DocumentationSection icon={<VscSymbolParameter size={20} />} padded title="Type Parameters">
			<TypeParamTable item={item} />
		</DocumentationSection>
	);
}
