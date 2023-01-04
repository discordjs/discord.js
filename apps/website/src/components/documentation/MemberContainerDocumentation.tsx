import type { ApiDeclaredItem, ApiItemContainerMixin, ApiTypeParameterListMixin } from '@microsoft/api-extractor-model';
import type { ReactNode } from 'react';
import { Outline } from '../Outline';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { Documentation } from './Documentation';
import { MethodsSection } from './section/MethodsSection';
import { PropertiesSection } from './section/PropertiesSection';
import { SummarySection } from './section/SummarySection';
import { TypeParameterSection } from './section/TypeParametersSection';
import { hasProperties, hasMethods, serializeMembers } from './util';

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
			{hasMethods(item) ? <MethodsSection item={item} version={version} /> : null}

			<Outline members={serializeMembers(item)} />
		</Documentation>
	);
}
