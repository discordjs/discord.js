'use server';

import type { ApiClassJSON } from '@discordjs/api-extractor-utils';
import { DocContainer } from '../DocContainer';
import { ConstructorSection, MethodsSection, PropertiesSection } from '../Sections';

export function Class({ data }: { data: ApiClassJSON }) {
	return (
		<DocContainer
			excerpt={data.excerpt}
			extendsTokens={data.extendsTokens}
			implementsTokens={data.implementsTokens}
			kind={data.kind}
			methods={data.methods}
			name={data.name}
			properties={data.properties}
			summary={data.summary}
			typeParams={data.typeParameters}
		>
			{data.constructor ? <ConstructorSection data={data.constructor} /> : null}
			<PropertiesSection data={data.properties} />
			<MethodsSection data={data.methods} />
		</DocContainer>
	);
}
