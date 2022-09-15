import type { ApiVariableJSON } from '@discordjs/api-extractor-utils';
import { DocContainer } from '../DocContainer';

export function Variable({ data }: { data: ApiVariableJSON }) {
	return <DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary} />;
}
