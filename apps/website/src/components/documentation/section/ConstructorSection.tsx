import type { ApiConstructor } from '@microsoft/api-extractor-model';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { ParameterTable } from '../../ParameterTable';
import { TSDoc } from '../tsdoc/TSDoc';
import { parametersString } from '../util';
import { DocumentationSection } from './DocumentationSection';
import { CodeHeading } from '~/components/CodeHeading';

export function ConstructorSection({ item }: { item: ApiConstructor }) {
	return (
		<DocumentationSection icon={<VscSymbolMethod size={20} />} padded title="Constructor">
			<div className="flex flex-col gap-2">
				<CodeHeading>{`constructor(${parametersString(item)})`}</CodeHeading>
				{item.tsdocComment ? <TSDoc item={item} tsdoc={item.tsdocComment} /> : null}
				<ParameterTable item={item} />
			</div>
		</DocumentationSection>
	);
}
