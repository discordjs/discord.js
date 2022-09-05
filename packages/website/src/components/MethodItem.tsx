import type { ApiMethodJSON, ApiMethodSignatureJSON } from '@discordjs/api-extractor-utils';
import { ActionIcon, Badge, MediaQuery, Title } from '@mantine/core';
import { FiLink } from 'react-icons/fi';
import { HyperlinkedText } from './HyperlinkedText';
import { InheritanceText } from './InheritanceText';
import { ParameterTable } from './ParameterTable';
import { TSDoc } from './tsdoc/TSDoc';

function getShorthandName(data: ApiMethodJSON | ApiMethodSignatureJSON) {
	return `${data.name}${data.optional ? '?' : ''}(${data.parameters.reduce((prev, cur, index) => {
		if (index === 0) {
			return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
		}

		return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
	}, '')})`;
}

export function MethodItem({ data }: { data: ApiMethodJSON | ApiMethodSignatureJSON }) {
	const method = data as ApiMethodJSON;
	const key = `${data.name}${data.overloadIndex && data.overloadIndex > 1 ? `:${data.overloadIndex}` : ''}`;

	return (
		<div id={key} className="scroll-mt-30 flex flex-col gap-2">
			<div className="flex-flex-col">
				<div className={`flex flex-col gap-2 md:-ml-9 md:flex-row md:place-items-center`}>
					<MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
						<ActionIcon component="a" href={`#${key}`} variant="transparent" color="dark">
							<FiLink size={20} />
						</ActionIcon>
					</MediaQuery>
					{data.deprecated ||
					(data.kind === 'Method' && method.protected) ||
					(data.kind === 'Method' && method.static) ? (
						<div className="flex flex-row flex-wrap gap-1">
							{data.deprecated ? (
								<Badge variant="filled" color="red">
									Deprecated
								</Badge>
							) : null}
							{data.kind === 'Method' && method.protected ? <Badge variant="filled">Protected</Badge> : null}
							{data.kind === 'Method' && method.static ? <Badge variant="filled">Static</Badge> : null}
						</div>
					) : null}
					<div className="flex flex-row flex-wrap gap-1">
						<Title sx={{ wordBreak: 'break-all' }} order={4} className="font-mono">{`${getShorthandName(data)}`}</Title>
						<Title order={4}>:</Title>
						<Title sx={{ wordBreak: 'break-all' }} order={4} className="font-mono">
							<HyperlinkedText tokens={data.returnTypeTokens} />
						</Title>
					</div>
				</div>
			</div>
			{data.summary || data.parameters.length ? (
				<div className={`mb-4 flex flex-col gap-4`}>
					{data.deprecated ? <TSDoc node={data.deprecated} /> : null}
					{data.summary ? <TSDoc node={data.summary} /> : null}
					{data.remarks ? <TSDoc node={data.remarks} /> : null}
					{data.comment ? <TSDoc node={data.comment} /> : null}
					{data.parameters.length ? <ParameterTable data={data.parameters} /> : null}
					{data.inheritanceData ? <InheritanceText data={data.inheritanceData} /> : null}
				</div>
			) : null}
		</div>
	);
}
