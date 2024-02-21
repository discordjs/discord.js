import type { ApiVariable } from '@discordjs/api-extractor-model';
import { Documentation } from '../documentation/Documentation';
import { ObjectHeader } from '../documentation/ObjectHeader';

export function Variable({ item }: { readonly item: ApiVariable }) {
	return (
		<Documentation>
			<ObjectHeader item={item} />
		</Documentation>
	);
}
