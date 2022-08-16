import { DocContainer } from '../DocContainer';
import type { DocVariable } from '~/DocModel/DocVariable';

export function Variable({ data }: { data: ReturnType<DocVariable['toJSON']> }) {
	return <DocContainer name={data.name} kind={data.kind} excerpt={data.excerpt} summary={data.summary} />;
}
