'use server';

import type { ApiClass } from '@microsoft/api-extractor-model';
import { SyntaxHighlighter } from '../SyntaxHighlighter';
import { Documentation } from '../documentation/Documentation';
import { ExtendsText } from '../documentation/ExtendsText';
import { MethodsSection } from '../documentation/section/MethodsSection';
import { PropertiesSection } from '../documentation/section/PropertiesSection';
import { SummarySection } from '../documentation/section/SummarySection';
import { TypeParameterSection } from '../documentation/section/TypeParametersSection';
import { hasMethods, hasProperties } from '../documentation/util';
// import { MethodsSection } from '../documentation/section/MethodsSection';
// import { PropertiesSection } from '../documentation/section/PropertiesSection';

export function Class({ clazz }: { clazz: ApiClass }) {
	return (
		<Documentation item={clazz}>
			<ExtendsText item={clazz} />
			<SyntaxHighlighter code={clazz.excerpt.text} />
			<SummarySection item={clazz} />
			{clazz.typeParameters.length ? <TypeParameterSection item={clazz} /> : null}
			{hasProperties(clazz) ? <PropertiesSection item={clazz} /> : null}
			{hasMethods(clazz) ? <MethodsSection item={clazz} /> : null}
		</Documentation>
	);
}
