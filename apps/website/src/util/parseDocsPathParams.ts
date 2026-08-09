import { DEFAULT_ENTRY_POINT } from './constants';

export function parseDocsPathParams(item: string[] | undefined): {
	entryPoints: string[];
	foundItem: string | undefined;
} {
	if (!item?.length) {
		return { entryPoints: [], foundItem: undefined };
	}

	const lastElement = item.at(-1);
	// Dynamic params reach `generateMetadata()` and `useParams()` decoded (`bold:Function`),
	// while the page component receives them raw (`bold%3AFunction`), so check for both forms.
	const hasTypeMarker = /:|%3a/i.test(lastElement ?? '');

	return {
		entryPoints: hasTypeMarker ? item.slice(0, -1) : lastElement?.length === 0 ? DEFAULT_ENTRY_POINT : item,
		foundItem: hasTypeMarker ? lastElement : undefined,
	};
}
