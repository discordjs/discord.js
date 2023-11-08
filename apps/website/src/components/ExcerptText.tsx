import type { ApiModel, Excerpt } from '@discordjs/api-extractor-model';
import { ExcerptTokenKind } from '@discordjs/api-extractor-model';
import { DISCORD_API_TYPES_DOCS_URL } from '~/util/constants';
import { ItemLink } from './ItemLink';
import { resolveItemURI } from './documentation/util';

export interface ExcerptTextProps {
	/**
	 * The tokens to render.
	 */
	readonly excerpt: Excerpt;
	/**
	 * The model to resolve item references from.
	 */
	readonly model: ApiModel;
}

/**
 * A component that renders excerpt tokens from an api item.
 */
export function ExcerptText({ model, excerpt }: ExcerptTextProps) {
	return (
		<span>
			{excerpt.spannedTokens.map((token, idx) => {
				// TODO: Real fix in api-extractor needed
				const text = token.text.replaceAll('\n', '').replaceAll(/\s{2}$/g, '');
				if (token.kind === ExcerptTokenKind.Reference) {
					const source = token.canonicalReference?.source;
					const symbol = token.canonicalReference?.symbol;
					if (source && 'packageName' in source && source.packageName === 'discord-api-types' && symbol) {
						const { meaning, componentPath: path } = symbol;
						let href = DISCORD_API_TYPES_DOCS_URL;

						// dapi-types doesn't have routes for class members
						// so we can assume this member is for an enum
						if (meaning === 'member' && path && 'parent' in path) href += `/enum/${path.parent}#${path.component}`;
						else if (meaning === 'type') href += `#${text}`;
						else href += `/${meaning}/${text}`;

						return (
							<a className="text-blurple" href={href} key={idx} rel="external noreferrer noopener" target="_blank">
								{text}
							</a>
						);
					}

					const item = model.resolveDeclarationReference(token.canonicalReference!, model).resolvedApiItem;

					if (!item) {
						return text;
					}

					return (
						<ItemLink
							className="text-blurple"
							itemURI={resolveItemURI(item)}
							key={`${item.displayName}-${item.containerKey}-${idx}`}
							packageName={item.getAssociatedPackage()?.displayName.replace('@discordjs/', '')}
						>
							{text}
						</ItemLink>
					);
				}

				return text.replace(/import\("discord-api-types(?:\/v\d+)?"\)\./, '');
			})}
		</span>
	);
}
