import type { ApiClass, ApiConstructor } from '@discordjs/api-extractor-model';
import { ApiItemKind } from '@discordjs/api-extractor-model';
import { Badges } from '../Badges';
import { Documentation } from '../documentation/Documentation';
import { HierarchyText } from '../documentation/HierarchyText';
import { Members } from '../documentation/Members';
import { ObjectHeader } from '../documentation/ObjectHeader';
import { ConstructorSection } from '../documentation/section/ConstructorSection';
import { TypeParameterSection } from '../documentation/section/TypeParametersSection';
import { serializeMembers } from '../documentation/util';
import { OutlineSetter } from './OutlineSetter';

export function Class({ clazz }: { readonly clazz: ApiClass }) {
	const constructor = clazz.members.find((member) => member.kind === ApiItemKind.Constructor) as
		| ApiConstructor
		| undefined;

	const outlineMembers = serializeMembers(clazz);

	return (
		<Documentation>
			<Badges item={clazz} />
			<ObjectHeader item={clazz} />
			<HierarchyText item={clazz} type="Extends" />
			<HierarchyText item={clazz} type="Implements" />
			{clazz.typeParameters.length ? <TypeParameterSection item={clazz} /> : null}
			{constructor ? <ConstructorSection item={constructor} /> : null}
			<Members item={clazz} />
			<OutlineSetter members={outlineMembers} />
		</Documentation>
	);
}
