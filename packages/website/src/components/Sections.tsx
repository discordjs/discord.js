import { VscSymbolMethod, VscSymbolProperty } from 'react-icons/vsc';
import { MethodList } from './MethodList';
import { ParameterTable } from './ParameterTable';
import { PropertyList } from './PropertyList';
import { Section } from './Section';
import type { DocInterface } from '~/DocModel/DocInterface';
import type { ParameterDocumentation } from '~/util/parse.server';

export interface PropertiesSectionProps {
	data: ReturnType<DocInterface['toJSON']>['properties'];
}

export function PropertiesSection({ data }: PropertiesSectionProps) {
	return data.length ? (
		<Section iconElement={<VscSymbolProperty />} title="Properties" className="dark:text-white">
			<PropertyList data={data} />
		</Section>
	) : null;
}

export interface MethodsSectionProps {
	data: ReturnType<DocInterface['toJSON']>['methods'];
}

export function MethodsSection({ data }: MethodsSectionProps) {
	return data.length ? (
		<Section iconElement={<VscSymbolMethod />} title="Methods" className="dark:text-white">
			<MethodList data={data} />
		</Section>
	) : null;
}

export interface ParametersSectionProps {
	data: ParameterDocumentation[];
}

export function ParametersSection({ data }: ParametersSectionProps) {
	return data.length ? (
		<Section title="Parameters" className="dark:text-white">
			<ParameterTable data={data} />
		</Section>
	) : null;
}
