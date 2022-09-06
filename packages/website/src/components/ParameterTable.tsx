import type { ParameterDocumentation } from '@discordjs/api-extractor-utils';
import { useMemo } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
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
		<Scrollbars
			universal
			autoHide
			hideTracksWhenNotNeeded
			renderTrackHorizontal={(props) => (
				<div {...props} className="absolute left-0.5 right-0.5 bottom-0.5 z-30 h-1.5 rounded" />
			)}
			renderThumbHorizontal={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
		>
			<Table columns={['Name', 'Type', 'Optional', 'Description']} rows={rows} columnStyles={columnStyles} />
		</Scrollbars>
	);
}
