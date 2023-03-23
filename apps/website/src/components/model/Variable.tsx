import type { ApiVariable } from '@microsoft/api-extractor-model';
import { Documentation } from '../documentation/Documentation';
import { ObjectHeader } from '../documentation/ObjectHeader';
import { SummarySection } from '../documentation/section/SummarySection';

export function Variable({ item }: { item: ApiVariable }) {
	return (
		<Documentation>
			<ObjectHeader item={item} />
			<SummarySection item={item} />
		</Documentation>
	);
}
