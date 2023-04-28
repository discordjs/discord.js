import type { ApiModel, Excerpt } from '@microsoft/api-extractor-model';
import { ExcerptTokenKind } from '@microsoft/api-extractor-model';
import { ItemLink } from './ItemLink';
import { resolveItemURI } from './documentation/util';
import { DISCORD_API_TYPES_DOCS_URL } from '~/util/constants';

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
		<span>
			{excerpt.spannedTokens.map((token, idx) => {
				if (token.kind === ExcerptTokenKind.Reference) {
					const source = token.canonicalReference?.source;

					if (source && 'packageName' in source && source.packageName === 'discord-api-types') {
						const meaning = token.canonicalReference.symbol?.meaning;
						const href =
							meaning === 'type'
								? `${DISCORD_API_TYPES_DOCS_URL}#${token.text}`
								: `${DISCORD_API_TYPES_DOCS_URL}/${meaning}/${token.text}`;

						return (
							<a className="text-blurple" href={href} key={idx} rel="external noreferrer noopener" target="_blank">
								{token.text}
							</a>
						);
					}

					const item = model.resolveDeclarationReference(token.canonicalReference!, model).resolvedApiItem;

					if (!item) {
						return token.text;
					}

					return (
						<ItemLink
							className="text-blurple"
							itemURI={resolveItemURI(item)}
							key={`${item.displayName}-${item.containerKey}`}
							packageName={item.getAssociatedPackage()?.displayName.replace('@discordjs/', '')}
						>
							{token.text}
						</ItemLink>
					);
				}

				return token.text;
			})}
		</span>
	);
}
