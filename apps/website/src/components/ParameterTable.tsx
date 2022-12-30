'use server';

import type { ApiParameterListMixin } from '@microsoft/api-extractor-model';
import { useMemo } from 'react';
import { HyperlinkedText } from './HyperlinkedText';
import { Table } from './Table';
import { TSDoc } from './documentation/tsdoc/TSDoc';
import { tokenize } from './documentation/util';

const columnStyles = {
	Name: 'font-mono whitespace-nowrap',
	Type: 'font-mono whitespace-pre-wrap break-normal',
};

export function ParameterTable({ item }: { item: ApiParameterListMixin }) {
	const rows = useMemo(
		() =>
			item.parameters.map((param) => ({
				Name: param.name,
				Type: (
					<HyperlinkedText tokens={tokenize(item.getAssociatedModel()!, param.parameterTypeExcerpt.spannedTokens)} />
				),
				Optional: param.isOptional ? 'Yes' : 'No',
				Description: param.tsdocParamBlock ? <TSDoc item={item} tsdoc={param.tsdocParamBlock.content} /> : 'None',
			})),
		[item],
	);

	return (
		<div className="overflow-x-auto">
			<Table columnStyles={columnStyles} columns={['Name', 'Type', 'Optional', 'Description']} rows={rows} />
		</div>
	);
}
