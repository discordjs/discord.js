import { DocContainer } from '../DocContainer';
import { MethodList } from '../MethodList';
import { PropertyList } from '../PropertyList';
import type { DocInterface } from '~/DocModel/DocInterface';

export interface InterfaceProps {
	data: ReturnType<DocInterface['toJSON']>;
}

export function Interface({ data }: InterfaceProps) {
	return (
		<DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary}>
			<>
				<PropertyList data={data.properties} />
				<MethodList data={data.methods} />
			</>
		</DocContainer>
	);
}
