import { Box } from '@mantine/core';
import { HyperlinkedText } from './HyperlinkedText';
import { Table } from './Table';
import type { ParameterDocumentation } from '~/util/parse.server';

export function ParameterTable({ data }: { data: ParameterDocumentation[] }) {
	const rows = data.map((param) => ({
		Name: param.name,
		Type: <HyperlinkedText tokens={param.tokens} />,
		Optional: param.isOptional ? 'Yes' : 'No',
		Description: 'None',
	}));

	const columnStyles = {
		Name: 'font-mono',
		Type: 'font-mono',
	};

	return (
		<Box className="overflow-x-auto">
			<Table columns={['Name', 'Type', 'Optional', 'Description']} rows={rows} columnStyles={columnStyles} />
		</Box>
	);
}
