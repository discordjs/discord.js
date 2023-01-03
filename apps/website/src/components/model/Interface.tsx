'use server';

import type { ApiInterface } from '@microsoft/api-extractor-model';
import { Outline } from '../Outline';
import { Documentation } from '../documentation/Documentation';
import { MethodsSection } from '../documentation/section/MethodsSection';
import { PropertiesSection } from '../documentation/section/PropertiesSection';
import { SummarySection } from '../documentation/section/SummarySection';
import { hasMethods, hasProperties, serializeMembers } from '../documentation/util';

export function Interface({ item, version }: { item: ApiInterface; version: string }) {
	return (
		<Documentation item={item}>
			<SummarySection item={item} />
			{hasProperties(item) ? <PropertiesSection item={item} version={version} /> : null}
			{hasMethods(item) ? <MethodsSection item={item} /> : null}
			<Outline members={serializeMembers(item)} />
		</Documentation>
	);
}
