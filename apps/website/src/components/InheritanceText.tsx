import type { ApiModel, Excerpt } from '@microsoft/api-extractor-model';
import { ExcerptTokenKind } from '@microsoft/api-extractor-model';
import { ItemLink } from './ItemLink';
import { resolveItemURI } from './documentation/util';

export function InheritanceText({ extendsExcerpt, model }: { extendsExcerpt: Excerpt; model: ApiModel }) {
	const parentTypeExcerpt = extendsExcerpt.spannedTokens.find((token) => token.kind === ExcerptTokenKind.Reference);

	if (!parentTypeExcerpt) {
		return null;
	}

	const parentItem = model.resolveDeclarationReference(parentTypeExcerpt.canonicalReference!, model).resolvedApiItem;

	if (!parentItem) {
		return null;
	}

	return (
		<span className="font-semibold">
			Inherited from{' '}
			<ItemLink
				className="text-blurple focus:ring-width-2 focus:ring-blurple rounded font-mono outline-0 focus:ring"
				itemURI={resolveItemURI(parentItem)}
			>
				{parentItem.displayName}
			</ItemLink>
		</span>
	);
}
