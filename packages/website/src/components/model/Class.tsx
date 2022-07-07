import { DocContainer } from '../DocContainer';
import { MethodList } from '../MethodList';
import { PropertyList } from '../PropertyList';
import type { DocClass } from '~/DocModel/DocClass';

export interface ClassProps {
	data: ReturnType<DocClass['toJSON']>;
}

export function Class({ data }: ClassProps) {
	return (
		<DocContainer
			name={data.name}
			kind={data.kind}
			excerpt={data.excerpt}
			summary={data.summary}
			typeParams={data.typeParameterData}
		>
			<>
				{data.properties.length ? <PropertyList data={data.properties} /> : null}
				{data.methods.length ? <MethodList data={data.methods} /> : null}
			</>
		</DocContainer>
	);
}
