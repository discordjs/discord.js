import type { ApiInterface } from '@discordjs/api-extractor-model';
import { Documentation } from '../documentation/Documentation';
import { HierarchyText } from '../documentation/HierarchyText';
import { Members } from '../documentation/Members';
import { ObjectHeader } from '../documentation/ObjectHeader';
import { TypeParameterSection } from '../documentation/section/TypeParametersSection';
import { serializeMembers } from '../documentation/util';
import { OutlineSetter } from './OutlineSetter';

export function Interface({ item }: { readonly item: ApiInterface }) {
	const outlineMembers = serializeMembers(item);

	return (
		<Documentation>
			<ObjectHeader item={item} />
			<HierarchyText item={item} type="Extends" />
			{item.typeParameters.length ? <TypeParameterSection item={item} /> : null}
			<Members item={item} />
			<OutlineSetter members={outlineMembers} />
		</Documentation>
	);
}
