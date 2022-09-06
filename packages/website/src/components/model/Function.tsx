import type { ApiFunctionJSON } from '@discordjs/api-extractor-utils';
import { DocContainer } from '../DocContainer';
import { ParametersSection } from '../Sections';

export function Function({ data }: { data: ApiFunctionJSON }) {
	return (
		<DocContainer
			name={`${data.name}${data.overloadIndex && data.overloadIndex > 1 ? ` (${data.overloadIndex})` : ''}`}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameters}
		>
			<ParametersSection data={data.parameters} />
		</DocContainer>
	);
}
