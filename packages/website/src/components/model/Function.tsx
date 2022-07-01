import { DocContainer } from '../DocContainer';
import { ParameterTable } from '../ParameterTable';
import type { DocFunction } from '~/DocModel/DocFunction';

export interface FunctionProps {
	data: ReturnType<DocFunction['toJSON']>;
}

export function Function({ data }: FunctionProps) {
	return (
		<DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary}>
			<ParameterTable data={data.parameters} />
		</DocContainer>
	);
}
