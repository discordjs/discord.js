import type { ApiModel, Excerpt } from '@microsoft/api-extractor-model';
import { ExcerptTokenKind } from '@microsoft/api-extractor-model';
import { ItemLink } from './ItemLink';

export interface ExcerptTextProps {
	/**
	 * The tokens to render.
	 */
	excerpt: Excerpt;
	/**
	 * The model to resolve item references from.
	 */
	model: ApiModel;
}

/**
 * A component that renders excerpt tokens from an api item.
 */
export function ExcerptText({ model, excerpt }: ExcerptTextProps) {
	return (
		<>
			{excerpt.spannedTokens.map((token) => {
				if (token.kind === ExcerptTokenKind.Reference) {
					const item = model.resolveDeclarationReference(token.canonicalReference!, model).resolvedApiItem;

					if (!item) {
						return token.text;
					}

					return (
						<ItemLink
							className="text-blurple"
							itemURI={`${item.displayName}:${item.kind}`}
							key={`${item.displayName}-${item.containerKey}`}
							packageName={item.getAssociatedPackage()?.displayName.replace('@discordjs/', '')}
						>
							{token.text}
						</ItemLink>
					);
				}

				return token.text;
			})}
		</>
	);
}
