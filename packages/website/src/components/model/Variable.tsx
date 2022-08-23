import { DocContainer } from '../DocContainer';
import type { ApiVariableJSON } from '~/DocModel/ApiNodeJSONEncoder';

export function Variable({ data }: { data: ApiVariableJSON }) {
	return <DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary} />;
}
