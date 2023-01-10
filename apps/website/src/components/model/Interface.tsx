import type { ApiInterface } from '@microsoft/api-extractor-model';
import { Outline } from '../Outline';
import { Documentation } from '../documentation/Documentation';
import { HierarchyText } from '../documentation/HierarchyText';
import { Members } from '../documentation/Members';
import { ObjectHeader } from '../documentation/ObjectHeader';
import { TypeParameterSection } from '../documentation/section/TypeParametersSection';
import { serializeMembers } from '../documentation/util';

export function Interface({ item }: { item: ApiInterface }) {
	return (
		<Documentation>
			<ObjectHeader item={item} />
			<HierarchyText item={item} type="Extends" />
			{item.typeParameters.length ? <TypeParameterSection item={item} /> : null}
			<Members item={item} />
			<Outline members={serializeMembers(item)} />
		</Documentation>
	);
}
