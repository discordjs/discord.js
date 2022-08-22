import { DocContainer } from '../DocContainer';
import type { ApiTypeAliasJSON } from '~/DocModel/ApiNodeJSONEncoder';

export function TypeAlias({ data }: { data: ApiTypeAliasJSON }) {
	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameters}
		/>
	);
}
