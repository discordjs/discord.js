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
		<Section title="Properties">
			<PropertyList data={data} />
		</Section>
	) : null;
}

export interface MethodsSectionProps {
	data: ReturnType<DocInterface['toJSON']>['methods'];
}

export function MethodsSection({ data }: MethodsSectionProps) {
	return data.length ? (
		<Section title="Methods">
			<MethodList data={data} />
		</Section>
	) : null;
}

export interface ParametersSectionProps {
	data: ParameterDocumentation[];
}

export function ParametersSection({ data }: ParametersSectionProps) {
	return data.length ? (
		<Section title="Parameters">
			<ParameterTable data={data} />
		</Section>
	) : null;
}
