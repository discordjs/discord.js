import { Group, Stack, Title } from '@mantine/core';
import { HyperlinkedText } from './HyperlinkedText';
import { ParameterTable } from './ParameterTable';
import { TSDoc } from './tsdoc/TSDoc';
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
		<Stack spacing="xs">
			<Group>
				<Stack>
					<Group>
						<Title order={4} className="font-mono break-all">{`${getShorthandName(data)}`}</Title>
						<Title order={4}>:</Title>
						<Title order={4} className="font-mono break-all">
							<HyperlinkedText tokens={data.returnTypeTokens} />
						</Title>
					</Group>
				</Stack>
			</Group>
			<Group sx={{ display: data.summary || data.parameters.length ? 'block' : 'none' }} mb="lg" ml="md">
				{data.summary ? <TSDoc node={data.summary} /> : null}
				{data.comment ? <TSDoc node={data.comment} /> : null}
				{data.parameters.length ? <ParameterTable data={data.parameters} /> : null}
			</Group>
		</Stack>
	);
}
