import { DocContainer } from '../DocContainer';
import { MethodsSection, PropertiesSection } from '../Sections';
import type { DocClass } from '~/DocModel/DocClass';

export function Class({ data }: { data: ReturnType<DocClass['toJSON']> }) {
	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameterData}
			extendsTokens={data.extendsTokens}
			implementsTokens={data.implementsTokens}
		>
			<PropertiesSection data={data.properties} />
			<MethodsSection data={data.methods} />
		</DocContainer>
	);
}
