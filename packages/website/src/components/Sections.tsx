import { useMediaQuery } from '@mantine/hooks';
import { VscSymbolConstant, VscSymbolMethod, VscSymbolProperty } from 'react-icons/vsc';
import { MethodList } from './MethodList';
import { ParameterTable } from './ParameterTable';
import { PropertyList } from './PropertyList';
import { Section } from './Section';
import type { ApiClassJSON, ApiInterfaceJSON } from '~/DocModel/ApiNodeJSONEncoder';
import type { ParameterDocumentation } from '~/util/parse.server';

export function PropertiesSection({ data }: { data: ApiClassJSON['properties'] | ApiInterfaceJSON['properties'] }) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return data.length ? (
		<Section title="Properties" icon={<VscSymbolProperty />} padded dense={matches}>
			<PropertyList data={data} />
		</Section>
	) : null;
}

export function MethodsSection({ data }: { data: ApiClassJSON['methods'] | ApiInterfaceJSON['methods'] }) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return data.length ? (
		<Section title="Methods" icon={<VscSymbolMethod />} padded dense={matches}>
			<MethodList data={data} />
		</Section>
	) : null;
}

export function ParametersSection({ data }: { data: ParameterDocumentation[] }) {
	const matches = useMediaQuery('(max-width: 768px)', true, { getInitialValueInEffect: false });

	return data.length ? (
		<Section title="Parameters" icon={<VscSymbolConstant />} padded dense={matches}>
			<ParameterTable data={data} />
		</Section>
	) : null;
}
