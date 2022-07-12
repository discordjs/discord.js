import { DocContainer } from '../DocContainer';
import { MethodsSection, PropertiesSection } from '../Sections';
import type { DocInterface } from '~/DocModel/DocInterface';

export interface InterfaceProps {
	data: ReturnType<DocInterface['toJSON']>;
}

export function Interface({ data }: InterfaceProps) {
	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameterData}
		>
			<PropertiesSection data={data.properties} />
			<MethodsSection data={data.methods} />
		</DocContainer>
	);
}
