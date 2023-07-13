import type { ApiVariable } from '@microsoft/api-extractor-model';
import { Documentation } from '../documentation/Documentation';
import { ObjectHeader } from '../documentation/ObjectHeader';

export function Variable({ item }: { item: ApiVariable }) {
	return (
		<Documentation>
			<ObjectHeader item={item} />
		</Documentation>
	);
}
