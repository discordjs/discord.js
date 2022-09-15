import type { ApiClassJSON } from '@discordjs/api-extractor-utils';
import { DocContainer } from '../DocContainer';
import { ConstructorSection, MethodsSection, PropertiesSection } from '../Sections';

export function Class({ data }: { data: ApiClassJSON }) {
	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameters}
			extendsTokens={data.extendsTokens}
			implementsTokens={data.implementsTokens}
			methods={data.methods}
			properties={data.properties}
		>
			{data.constructor ? <ConstructorSection data={data.constructor} /> : null}
			<PropertiesSection data={data.properties} />
			<MethodsSection data={data.methods} />
		</DocContainer>
	);
}
