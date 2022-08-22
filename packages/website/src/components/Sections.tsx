import { Stack, Group, Badge, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { VscSymbolConstant, VscSymbolMethod, VscSymbolProperty } from 'react-icons/vsc';

import { MethodList } from './MethodList';
import { ParameterTable } from './ParameterTable';
import { PropertyList } from './PropertyList';
import { Section } from './Section';
import { TSDoc } from './tsdoc/TSDoc';
import type { ApiClassJSON, ApiConstructorJSON, ApiInterfaceJSON } from '~/DocModel/ApiNodeJSONEncoder';
import type { ParameterDocumentation } from '~/util/parse.server';

export function PropertiesSection({ data }: { data: ApiClassJSON['properties'] | ApiInterfaceJSON['properties'] }) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return data.length ? (
		<Section title="Properties" icon={<VscSymbolProperty size={20} />} padded dense={matches}>
			<PropertyList data={data} />
		</Section>
	) : null;
}

export function MethodsSection({ data }: { data: ApiClassJSON['methods'] | ApiInterfaceJSON['methods'] }) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return data.length ? (
		<Section title="Methods" icon={<VscSymbolMethod size={20} />} padded dense={matches}>
			<MethodList data={data} />
		</Section>
	) : null;
}

export function ParametersSection({ data }: { data: ParameterDocumentation[] }) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return data.length ? (
		<Section title="Parameters" icon={<VscSymbolConstant size={20} />} padded dense={matches}>
			<ParameterTable data={data} />
		</Section>
	) : null;
}

export function ConstructorSection({ data }: { data: ApiConstructorJSON }) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	const getShorthandName = () =>
		`constructor(${data.parameters.reduce((prev, cur, index) => {
			if (index === 0) {
				return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
			}

			return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
		}, '')})`;

	return data.parameters.length ? (
		<Section title="Constructor" icon={<VscSymbolMethod size={20} />} padded dense={matches}>
			<Stack id={`${data.name}`} className="scroll-mt-30" spacing="xs">
				<Group>
					<Stack>
						<Group>
							{data.deprecated ? (
								<Badge variant="filled" color="red">
									Deprecated
								</Badge>
							) : null}
							{data.protected ? <Badge variant="filled">Protected</Badge> : null}
							<Title sx={{ wordBreak: 'break-all' }} order={4} className="font-mono">
								{getShorthandName()}
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
					</Stack>
				</Group>
			</Stack>
		</Section>
	) : null;
}
