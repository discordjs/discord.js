import type { ParameterDocumentation } from '@discordjs/api-extractor-utils';
import { ScrollArea } from '@mantine/core';
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
		<div>
			<ScrollArea pb="xs" offsetScrollbars>
				<Table columns={['Name', 'Type', 'Optional', 'Description']} rows={rows} columnStyles={columnStyles} />
			</ScrollArea>
		</div>
	);
}
