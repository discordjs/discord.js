'use server';

import type { ApiTypeParameterListMixin } from '@microsoft/api-extractor-model';
import { useMemo } from 'react';
import { HyperlinkedText } from './HyperlinkedText';
import { Table } from './Table';
import { TSDoc } from './documentation/tsdoc/TSDoc';
import { tokenize } from './documentation/util';

const rowElements = {
	Name: 'font-mono whitespace-nowrap',
	Constraints: 'font-mono whitespace-pre break-normal',
	Default: 'font-mono whitespace-pre break-normal',
};

export function TypeParamTable({ item }: { item: ApiTypeParameterListMixin }) {
	const rows = useMemo(
		() =>
			item.typeParameters.map((typeParam) => ({
				Name: typeParam.name,
				Constraints: (
					<HyperlinkedText tokens={tokenize(item.getAssociatedModel()!, typeParam.constraintExcerpt.spannedTokens)} />
				),
				Optional: typeParam.isOptional ? 'Yes' : 'No',
				Default: (
					<HyperlinkedText tokens={tokenize(item.getAssociatedModel()!, typeParam.defaultTypeExcerpt.spannedTokens)} />
				),
				Description: typeParam.tsdocTypeParamBlock ? (
					<TSDoc item={item} tsdoc={typeParam.tsdocTypeParamBlock.content} />
				) : (
					'None'
				),
			})),
		[item],
	);

	return (
		<div className="overflow-x-auto">
			<Table
				columnStyles={rowElements}
				columns={['Name', 'Constraints', 'Optional', 'Default', 'Description']}
				rows={rows}
			/>
		</div>
	);
}
