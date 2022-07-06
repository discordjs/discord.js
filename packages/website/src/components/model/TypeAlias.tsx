import { DocContainer } from '../DocContainer';
import type { DocTypeAlias } from '~/DocModel/DocTypeAlias';

export interface TypeAliasProps {
	data: ReturnType<DocTypeAlias['toJSON']>;
}

export function TypeAlias({ data }: TypeAliasProps) {
	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameterData}
		>
			<div>WIP</div>
		</DocContainer>
	);
}
