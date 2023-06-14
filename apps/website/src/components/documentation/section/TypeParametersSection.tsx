import type { ApiTypeParameterListMixin } from '@microsoft/api-extractor-model';
import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { TypeParamTable } from '../../TypeParamTable';
import { DocumentationSection } from './DocumentationSection';

export function TypeParameterSection({ item }: { item: ApiTypeParameterListMixin }) {
	return (
		<DocumentationSection icon={<VscSymbolParameter size={20} />} padded title="Type Parameters">
			<TypeParamTable item={item} />
		</DocumentationSection>
	);
}
