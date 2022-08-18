import { DocContainer } from '../DocContainer';
import { ParametersSection } from '../Sections';
import type { DocFunction } from '~/DocModel/DocFunction';

export function Function({ data }: { data: ReturnType<DocFunction['toJSON']> }) {
	return (
		<DocContainer
			name={`${data.name}${data.overloadIndex && data.overloadIndex > 1 ? ` (${data.overloadIndex})` : ''}`}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameterData}
		>
			<ParametersSection data={data.parameters} />
		</DocContainer>
	);
}
