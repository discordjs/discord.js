'use server';

import type { ApiClass, ApiItem, ApiPropertyItem } from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { Fragment, useMemo } from 'react';
import { Property, PropertySeparatorType } from './Property';

export function PropertyList({ item, version }: { item: ApiItem; version: string }) {
	const propertyItems = useMemo(
		() =>
			item.members
				.filter((member) => member.kind === ApiItemKind.Property || member.kind === ApiItemKind.PropertySignature)
				.map((prop) => (
					<Fragment key={prop.displayName}>
						<Property
							item={prop as ApiPropertyItem}
							parentKey={item.containerKey}
							separator={PropertySeparatorType.Type}
							version={version}
						/>
						<div className="border-light-900 dark:border-dark-100 -mx-8 border-t-2" />
					</Fragment>
				)),
		[item.containerKey, item.members, version],
	);

	return <div className="flex flex-col gap-4">{propertyItems}</div>;
}

declare const test: ApiClass;
