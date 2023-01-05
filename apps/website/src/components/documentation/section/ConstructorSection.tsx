import type { ApiConstructor } from '@microsoft/api-extractor-model';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { TSDoc } from '../tsdoc/TSDoc';
import { SectionShell } from './SectionShell';
import { ParameterTable } from '~/components/ParameterTable';

export function ConstructorSection({ item, version }: { item: ApiConstructor; version: string }) {
	return (
		<SectionShell icon={<VscSymbolMethod size={20} />} padded title="Constructor">
			{item.tsdocComment ? <TSDoc item={item} tsdoc={item.tsdocComment} version={version} /> : null}
			<ParameterTable item={item} />
		</SectionShell>
	);
}
