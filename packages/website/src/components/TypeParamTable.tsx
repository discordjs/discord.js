import { HyperlinkedText } from './HyperlinkedText';
import { Table } from './Table';
import type { TypeParameterData } from '~/util/parse.server';

export function TypeParamTable({ data }: { data: TypeParameterData[] }) {
	const rows = data.map((typeParam) => ({
		Name: typeParam.name,
		Constraints: <HyperlinkedText tokens={typeParam.constraintTokens} />,
		Optional: typeParam.optional ? 'Yes' : 'No',
		Default: <HyperlinkedText tokens={typeParam.defaultTokens} />,
		Description: 'None',
	}));

	const rowElements = {
		Name: 'font-mono',
		Constraints: 'font-mono',
		Default: 'font-mono',
	};

	return (
		<Table
			columns={['Name', 'Constraints', 'Optional', 'Default', 'Description']}
			rows={rows}
			columnStyles={rowElements}
		/>
	);
}
