import type {
	ApiDeclaredItem,
	ApiItem,
	ApiItemContainerMixin,
	ApiProperty,
	ApiPropertySignature,
} from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { Fragment, useMemo } from 'react';
import { Property } from './Property';
import { resolveMembers } from '~/util/members';

export function isPropertyLike(item: ApiItem): item is ApiProperty | ApiPropertySignature {
	return item.kind === ApiItemKind.Property || item.kind === ApiItemKind.PropertySignature;
}

export function PropertyList({ item }: { item: ApiItemContainerMixin }) {
	const members = resolveMembers(item, isPropertyLike);

	const propertyItems = useMemo(
		() =>
			members.map((prop, idx) => {
				return (
					<Fragment key={`${prop.item.displayName}-${idx}`}>
						<Property
							inheritedFrom={prop.inherited as ApiDeclaredItem & ApiItemContainerMixin}
							item={prop.item as ApiProperty}
						/>
						<div className="border-t-2 border-light-900 dark:border-dark-100" />
					</Fragment>
				);
			}),
		[members],
	);

	return <div className="flex flex-col gap-4">{propertyItems}</div>;
}
