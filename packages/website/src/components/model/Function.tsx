import { DocContainer } from '../DocContainer';
import { ParametersSection } from '../Sections';
import type { ApiFunctionJSON } from '~/DocModel/ApiNodeJSONEncoder';

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
