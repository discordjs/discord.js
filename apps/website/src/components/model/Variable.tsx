'use server';

import type { ApiVariableJSON } from '@discordjs/api-extractor-utils';
import { DocContainer } from '../DocContainer';

export function Variable({ data }: { data: ApiVariableJSON }) {
	return null;
	// return <DocContainer excerpt={data.excerpt} kind={data.kind} name={data.name} summary={data.summary} />;
}
