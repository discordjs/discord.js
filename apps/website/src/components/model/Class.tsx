'use server';

import type { ApiClass } from '@microsoft/api-extractor-model';
import { Documentation } from '../documentation/Documentation';
import { MethodsSection } from '../documentation/section/MethodsSection';
import { PropertiesSection } from '../documentation/section/PropertiesSection';
// import { MethodsSection } from '../documentation/section/MethodsSection';
// import { PropertiesSection } from '../documentation/section/PropertiesSection';

export function Class({ clazz }: { clazz: ApiClass }) {
	return (
		<div>
			<Documentation item={clazz} />
			<PropertiesSection item={clazz} />
			<MethodsSection item={clazz} />
		</div>
	);
}
