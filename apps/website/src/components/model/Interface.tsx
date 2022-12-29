'use server';

import type { ApiInterfaceJSON } from '@discordjs/api-extractor-utils';
import { DocContainer } from '../DocContainer';
import { MethodsSection, PropertiesSection } from '../Sections';

export function Interface({ data }: { data: ApiInterfaceJSON }) {
	return (
		<DocContainer
			excerpt={data.excerpt}
			kind={data.kind}
			methods={data.methods}
			name={data.name}
			properties={data.properties}
			summary={data.summary}
			typeParams={data.typeParameters}
		>
			<PropertiesSection data={data.properties} />
			<MethodsSection data={data.methods} />
		</DocContainer>
	);
}
