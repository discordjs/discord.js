import { Badge, Group, Stack, Title } from '@mantine/core';
import { HyperlinkedText } from './HyperlinkedText';
import { InheritanceText } from './InheritanceText';
import { ParameterTable } from './ParameterTable';
import { TSDoc } from './tsdoc/TSDoc';
import type { ApiMethodJSON, ApiMethodSignatureJSON } from '~/DocModel/ApiNodeJSONEncoder';
import { Visibility } from '~/DocModel/Visibility';

type MethodResolvable = ApiMethodJSON | ApiMethodSignatureJSON;

function getShorthandName(data: MethodResolvable) {
	return `${data.name}${data.optional ? '?' : ''}(${data.parameters.reduce((prev, cur, index) => {
		if (index === 0) {
			return `${prev}${cur.isOptional ? `[${cur.name}]` : cur.name}`;
		}

		return `${prev}, ${cur.isOptional ? `[${cur.name}]` : cur.name}`;
	}, '')})`;
}

export function MethodItem({ data }: { data: MethodResolvable }) {
	const method = data as ApiMethodJSON;

	return (
		<Stack
			id={`${data.name}${data.overloadIndex && data.overloadIndex > 1 ? `:${data.overloadIndex}` : ''}`}
			className="scroll-mt-30"
			spacing="xs"
		>
			<Group>
				<Stack>
					<Group>
						{data.deprecated ? (
							<Badge variant="filled" color="red">
								Deprecated
							</Badge>
						) : null}
						{data.kind === 'Method' && method.visibility === Visibility.Protected ? (
							<Badge variant="filled">Protected</Badge>
						) : null}
						{data.kind === 'Method' && method.static ? <Badge variant="filled">Static</Badge> : null}
						<Title sx={{ wordBreak: 'break-all' }} order={4} className="font-mono">{`${getShorthandName(data)}`}</Title>
						<Title order={4}>:</Title>
						<Title sx={{ wordBreak: 'break-all' }} order={4} className="font-mono">
							<HyperlinkedText tokens={data.returnTypeTokens} />
						</Title>
					</Group>
				</Stack>
			</Group>
			<Group sx={{ display: data.summary || data.parameters.length ? 'block' : 'none' }} mb="lg">
				<Stack>
					{data.deprecated ? <TSDoc node={data.deprecated} /> : null}
					{data.summary ? <TSDoc node={data.summary} /> : null}
					{data.remarks ? <TSDoc node={data.remarks} /> : null}
					{data.comment ? <TSDoc node={data.comment} /> : null}
					{data.parameters.length ? <ParameterTable data={data.parameters} /> : null}
					{data.inheritanceData ? <InheritanceText data={data.inheritanceData} /> : null}
				</Stack>
			</Group>
		</Stack>
	);
}
