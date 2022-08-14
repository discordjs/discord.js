import { DocContainer } from '../DocContainer';
import type { DocTypeAlias } from '~/DocModel/DocTypeAlias';

export function TypeAlias({ data }: { data: ReturnType<DocTypeAlias['toJSON']> }) {
	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameterData}
		/>
	);
}
