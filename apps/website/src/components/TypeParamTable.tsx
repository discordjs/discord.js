'use client';

import type { TypeParameterData } from '@discordjs/api-extractor-utils';
import { useMemo } from 'react';
import { HyperlinkedText } from './HyperlinkedText';
import { Table } from './Table';
import { TSDoc } from './tsdoc/TSDoc';

const rowElements = {
	Name: 'font-mono whitespace-nowrap',
	Constraints: 'font-mono whitespace-pre break-normal',
	Default: 'font-mono whitespace-pre break-normal',
};

export function TypeParamTable({ data }: { data: TypeParameterData[] }) {
	const rows = useMemo(
		() =>
			data.map((typeParam) => ({
				Name: typeParam.name,
				Constraints: <HyperlinkedText tokens={typeParam.constraintTokens} />,
				Optional: typeParam.optional ? 'Yes' : 'No',
				Default: <HyperlinkedText tokens={typeParam.defaultTokens} />,
				Description: typeParam.commentBlock ? <TSDoc node={typeParam.commentBlock} /> : 'None',
			})),
		[data],
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
