import type {
	ApiDeclaredItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
	ApiTypeParameterListMixin,
} from '@microsoft/api-extractor-model';
import type { ReactNode } from 'react';
import { Outline } from '../Outline';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import type { TableOfContentsSerialized } from '../TableOfContentItems';
import { Documentation } from './Documentation';
import { MethodsSection } from './section/MethodsSection';
import { PropertiesSection } from './section/PropertiesSection';
import { SummarySection } from './section/SummarySection';
import { TypeParameterSection } from './section/TypeParametersSection';
import { hasProperties, hasMethods } from './util';

function serializeMembers(clazz: ApiItemContainerMixin): TableOfContentsSerialized[] {
	return clazz.members.map((member) => {
		if (member.kind === 'Method' || member.kind === 'MethodSignature') {
			return {
				kind: member.kind as 'Method' | 'MethodSignature',
				name: member.displayName,
			};
		} else {
			return {
				kind: member.kind as 'Property' | 'PropertySignature',
				name: member.displayName,
				overloadIndex: (member as ApiMethod | ApiMethodSignature).overloadIndex,
			};
		}
	});
}

export function MemberContainerDocumentation({
	item,
	version,
	subheading,
}: {
	item: ApiDeclaredItem & ApiItemContainerMixin & ApiTypeParameterListMixin;
	subheading?: ReactNode;
	version: string;
}) {
	return (
		<Documentation item={item}>
			{subheading}
			<SyntaxHighlighter code={item.excerpt.text} />
			<SummarySection item={item} />
			{item.typeParameters.length ? <TypeParameterSection item={item} /> : null}
			{hasProperties(item) ? <PropertiesSection item={item} version={version} /> : null}
			{hasMethods(item) ? <MethodsSection item={item} /> : null}

			<Outline members={serializeMembers(item)} />
		</Documentation>
	);
}
