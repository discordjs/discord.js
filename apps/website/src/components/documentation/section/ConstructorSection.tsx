import type { ApiConstructor } from '@microsoft/api-extractor-model';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { useCallback } from 'react';
import { TSDoc } from '../tsdoc/TSDoc';
import { ResponsiveSection } from './ResponsiveSection';
import { ParameterTable } from '~/components/ParameterTable';

export function ConstructorSection({ item }: { item: ApiConstructor }) {
	const getShorthandName = useCallback(
		(ctor: ApiConstructor) =>
			`constructor(${ctor.parameters.reduce((prev, cur, index) => {
				if (index === 0) {
					return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
				}

				return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
			}, '')})`,
		[],
	);

	return (
		<ResponsiveSection icon={<VscSymbolMethod size={20} />} padded title="Constructor">
			<div className="flex flex-col gap-2">
				<h4 className="break-all font-mono text-lg font-bold">{getShorthandName(item)}</h4>
				{item.tsdocComment ? <TSDoc item={item} tsdoc={item.tsdocComment} /> : null}
				<ParameterTable item={item} />
			</div>
		</ResponsiveSection>
	);
}
