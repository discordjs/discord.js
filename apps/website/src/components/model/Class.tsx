import type { ApiClass, ApiConstructor } from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { Outline } from '../Outline';
import { Documentation } from '../documentation/Documentation';
import { HierarchyText } from '../documentation/ExtendsText';
import { Members } from '../documentation/Members';
import { ObjectHeader } from '../documentation/ObjectHeader';
import { ConstructorSection } from '../documentation/section/ConstructorSection';
import { TypeParameterSection } from '../documentation/section/TypeParametersSection';
import { serializeMembers } from '../documentation/util';

export function Class({ clazz }: { clazz: ApiClass }) {
	const constructor = clazz.members.find((member) => member.kind === ApiItemKind.Constructor) as
		| ApiConstructor
		| undefined;

	return (
		<Documentation>
			<ObjectHeader item={clazz} />
			<HierarchyText item={clazz} type="Extends" />
			<HierarchyText item={clazz} type="Implements" />
			{clazz.typeParameters.length ? <TypeParameterSection item={clazz} /> : null}
			{constructor ? <ConstructorSection item={constructor} /> : null}
			<Members item={clazz} />
			<Outline members={serializeMembers(clazz)} />
		</Documentation>
	);
}
