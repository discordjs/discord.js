import { Group, Stack, Title } from '@mantine/core';
import { HyperlinkedText } from './HyperlinkedText';
import { ParameterTable } from './ParameterTable';
import { CommentSection } from './tsdoc/Comment';
import type { DocMethod } from '~/DocModel/DocMethod';
import type { DocMethodSignature } from '~/DocModel/DocMethodSignature';

type MethodResolvable = ReturnType<DocMethod['toJSON']> | ReturnType<DocMethodSignature['toJSON']>;

function getShorthandName(data: MethodResolvable) {
	return `${data.name}(${data.parameters.reduce((prev, cur, index) => {
		if (index === 0) {
			return `${prev}${cur.name}`;
		}

		return `${prev}, ${cur.name}`;
	}, '')})`;
}

export function MethodItem({ data }: { data: MethodResolvable }) {
	return (
		<Stack>
			<Group>
				<Stack>
					<Group>
						<Title order={5} className="font-mono break-all">{`${getShorthandName(data)}`}</Title>
						<Title order={5}>:</Title>
						<Title order={5} className="font-mono break-all">
							<HyperlinkedText tokens={data.returnTypeTokens} />
						</Title>
					</Group>
				</Stack>
			</Group>
			<Group sx={{ display: data.summary || data.parameters.length ? 'block' : 'none' }} mb="lg">
				{data.summary ? <CommentSection node={data.summary} /> : null}
				{data.comment ? <CommentSection node={data.comment} /> : null}
				{data.parameters.length ? <ParameterTable data={data.parameters} /> : null}
			</Group>
		</Stack>
	);
}
