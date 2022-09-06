import type { TypeParameterData } from '@discordjs/api-extractor-utils';
import { useMemo } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
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
		<Scrollbars
			universal
			autoHide
			hideTracksWhenNotNeeded
			renderTrackHorizontal={(props) => (
				<div {...props} className="absolute left-0.5 right-0.5 bottom-0.5 z-30 h-1.5 rounded" />
			)}
			renderThumbHorizontal={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
		>
			<Table
				columns={['Name', 'Constraints', 'Optional', 'Default', 'Description']}
				rows={rows}
				columnStyles={rowElements}
			/>
		</Scrollbars>
	);
}
