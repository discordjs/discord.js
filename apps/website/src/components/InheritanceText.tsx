import type { ApiDeclaredItem } from '@microsoft/api-extractor-model';
import { ItemLink } from './ItemLink';
import { resolveItemURI } from './documentation/util';

export function InheritanceText({ parent }: { parent: ApiDeclaredItem }) {
	return (
		<span className="font-semibold">
			Inherited from{' '}
			<ItemLink
				className="rounded font-mono text-blurple outline-0 focus:ring focus:ring-width-2 focus:ring-blurple"
				itemURI={resolveItemURI(parent)}
			>
				{parent.displayName}
			</ItemLink>
		</span>
	);
}
