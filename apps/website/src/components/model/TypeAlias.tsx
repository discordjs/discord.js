import type { ApiTypeAliasJSON } from '@discordjs/api-extractor-utils';
import { DocContainer } from '../DocContainer';

export function TypeAlias({ data }: { data: ApiTypeAliasJSON }) {
	return (
		<DocContainer
			excerpt={data.excerpt}
			kind={data.kind}
			name={data.name}
			summary={data.summary}
			typeParams={data.typeParameters}
		/>
	);
}
