import type { ApiItem, ApiItemContainerMixin } from '@microsoft/api-extractor-model';

/**
 * Resolves all inherited members (including merged members) of a given parent.
 *
 * @param parent - The parent to resolve the inherited members of.
 * @param predicate - A predicate to filter the members by.
 */
export function resolveMembers<T extends ApiItem>(
	parent: ApiItemContainerMixin,
	predicate: (item: ApiItem) => item is T,
) {
	const seenItems = new Set<string>();
	const inheritedMembers = parent.findMembersWithInheritance().items.reduce((acc, item) => {
		if (predicate(item) && !seenItems.has(item.displayName)) {
			acc.push({
				item,
				inherited:
					item.parent?.containerKey === parent.containerKey
						? undefined
						: (item.parent as ApiItemContainerMixin | undefined),
			});

			seenItems.add(item.displayName);
		}

		return acc;
	}, new Array<{ inherited?: ApiItemContainerMixin | undefined; item: T }>());

	const mergedMembers = parent
		.getMergedSiblings()
		.filter((sibling) => sibling.containerKey !== parent.containerKey)
		.flatMap((sibling) => (sibling as ApiItemContainerMixin).findMembersWithInheritance().items)
		.filter((item) => predicate(item) && !seenItems.has(item.containerKey))
		.map((item) => ({ item: item as T, inherited: item.parent ? (item.parent as ApiItemContainerMixin) : undefined }));

	return [...inheritedMembers, ...mergedMembers];
}
