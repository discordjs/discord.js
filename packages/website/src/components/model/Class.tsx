import { DocContainer } from '../DocContainer';
import { MethodsSection, PropertiesSection } from '../Sections';
import type { ApiClassJSON } from '~/DocModel/ApiNodeJSONEncoder';

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
			comment={data.comment}
			methods={data.methods}
		>
			<PropertiesSection data={data.properties} />
			<MethodsSection data={data.methods} />
		</DocContainer>
	);
}
