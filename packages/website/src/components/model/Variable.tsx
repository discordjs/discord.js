import { DocContainer } from '../DocContainer';
import type { DocVariable } from '~/DocModel/DocVariable';

export interface VariableProps {
	data: ReturnType<DocVariable['toJSON']>;
}

export function Variable({ data }: VariableProps) {
	return <DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary} />;
}
