import type { ApiClass, ApiConstructor } from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { Outline } from '../Outline';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { Documentation } from '../documentation/Documentation';
import { ExtendsText } from '../documentation/ExtendsText';
import { ConstructorSection } from '../documentation/section/ConstructorSection';
import { MethodsSection } from '../documentation/section/MethodsSection';
import { PropertiesSection } from '../documentation/section/PropertiesSection';
import { SummarySection } from '../documentation/section/SummarySection';
import { TypeParameterSection } from '../documentation/section/TypeParametersSection';
import { hasProperties, hasMethods, serializeMembers } from '../documentation/util';

export function Class({ clazz }: { clazz: ApiClass }) {
	const constructor = clazz.members.find((member) => member.kind === ApiItemKind.Constructor) as
		| ApiConstructor
		| undefined;

	return (
		<Documentation item={clazz}>
			<ExtendsText item={clazz} />
			<SyntaxHighlighter code={clazz.excerpt.text} />
			<SummarySection item={clazz} />
			{clazz.typeParameters.length ? <TypeParameterSection item={clazz} /> : null}
			{constructor ? <ConstructorSection item={constructor} /> : null}
			{hasProperties(clazz) ? <PropertiesSection item={clazz} /> : null}
			{hasMethods(clazz) ? <MethodsSection item={clazz} /> : null}

			<Outline members={serializeMembers(clazz)} />
		</Documentation>
	);
}
