export function parseDocsPathParams(item: string[] | undefined): {
	entryPoints: string[];
	foundItem: string | undefined;
} {
	if (!item?.length) {
		return { entryPoints: [], foundItem: undefined };
	}

	const lastElement = item.at(-1);
	const hasTypeMarker = lastElement?.includes('%3A');

	return {
		entryPoints: hasTypeMarker ? item.slice(0, -1) : item,
		foundItem: hasTypeMarker ? lastElement : undefined,
	};
}
