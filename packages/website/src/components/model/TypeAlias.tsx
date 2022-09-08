import type { ApiTypeAliasJSON } from '@discordjs/api-extractor-utils';
import { DocContainer } from '../DocContainer';

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
