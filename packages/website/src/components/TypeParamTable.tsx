import type { TypeParameterData } from '@discordjs/api-extractor-utils';
import { ScrollArea } from '@mantine/core';
import { HyperlinkedText } from './HyperlinkedText.jsx';
import { Table } from './Table.jsx';
import { TSDoc } from './tsdoc/TSDoc.jsx';

const rowElements = {
	Name: 'font-mono whitespace-nowrap',
	Constraints: 'font-mono whitespace-pre break-normal',
	Default: 'font-mono whitespace-pre break-normal',
};

export function TypeParamTable({ data }: { data: TypeParameterData[] }) {
	const rows = data.map((typeParam) => ({
		Name: typeParam.name,
		Constraints: <HyperlinkedText tokens={typeParam.constraintTokens} />,
		Optional: typeParam.optional ? 'Yes' : 'No',
		Default: <HyperlinkedText tokens={typeParam.defaultTokens} />,
		Description: typeParam.commentBlock ? <TSDoc node={typeParam.commentBlock} /> : 'None',
	}));

	return (
		<ScrollArea pb="xs" offsetScrollbars>
			<Table
				columns={['Name', 'Constraints', 'Optional', 'Default', 'Description']}
				rows={rows}
				columnStyles={rowElements}
			/>
		</ScrollArea>
	);
}
