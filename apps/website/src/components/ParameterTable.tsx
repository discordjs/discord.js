'use client';

import type { ParameterDocumentation } from '@discordjs/api-extractor-utils';
import { useMemo } from 'react';
import { HyperlinkedText } from './HyperlinkedText';
import { Table } from './Table';
import { TSDoc } from './tsdoc/TSDoc';

const columnStyles = {
	Name: 'font-mono whitespace-nowrap',
	Type: 'font-mono whitespace-pre-wrap break-normal',
};

export function ParameterTable({ data }: { data: ParameterDocumentation[] }) {
	const rows = useMemo(
		() =>
			data.map((param) => ({
				Name: param.name,
				Type: <HyperlinkedText tokens={param.tokens} />,
				Optional: param.isOptional ? 'Yes' : 'No',
				Description: param.paramCommentBlock ? <TSDoc node={param.paramCommentBlock} /> : 'None',
			})),
		[data],
	);

	return (
		<div className="overflow-x-auto">
			<Table columnStyles={columnStyles} columns={['Name', 'Type', 'Optional', 'Description']} rows={rows} />
		</div>
	);
}
