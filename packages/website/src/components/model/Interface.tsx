import { DocContainer } from '../DocContainer';
import { MethodsSection, PropertiesSection } from '../Sections';
import type { ApiInterfaceJSON } from '~/DocModel/ApiNodeJSONEncoder';

export function Interface({ data }: { data: ApiInterfaceJSON }) {
	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameters}
			methods={data.methods}
			properties={data.properties}
		>
			<PropertiesSection data={data.properties} />
			<MethodsSection data={data.methods} />
		</DocContainer>
	);
}
