import { Box } from '@mantine/core';
import { HyperlinkedText } from './HyperlinkedText';
import { Table } from './Table';
import { TSDoc } from './tsdoc/TSDoc';
import type { ParameterDocumentation } from '~/util/parse.server';

export function ParameterTable({ data }: { data: ParameterDocumentation[] }) {
	const rows = data.map((param) => ({
		Name: param.name,
		Type: <HyperlinkedText tokens={param.tokens} />,
		Optional: param.isOptional ? 'Yes' : 'No',
		Description: param.paramCommentBlock ? <TSDoc node={param.paramCommentBlock} /> : 'None',
	}));

	const columnStyles = {
		Name: 'font-mono whitespace-nowrap',
		Type: 'font-mono whitespace-pre-wrap max-w-[250px] break-normal',
	};

	return (
		<Box sx={{ overflowX: 'auto' }}>
			<Table columns={['Name', 'Type', 'Optional', 'Description']} rows={rows} columnStyles={columnStyles} />
		</Box>
	);
}
