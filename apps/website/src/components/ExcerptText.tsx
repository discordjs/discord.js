import type { ApiModel, Excerpt } from '@microsoft/api-extractor-model';
import { ExcerptTokenKind } from '@microsoft/api-extractor-model';
import Link from 'next/link';
import { ItemLink } from './ItemLink';
import { resolveItemURI } from './documentation/util';

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
			{excerpt.spannedTokens.map((token, idx) => {
				if (token.kind === ExcerptTokenKind.Reference) {
					const source = token.canonicalReference?.source;

					if (source && 'packageName' in source && source.packageName === 'discord-api-types') {
						const base = 'https://discord-api-types.dev/api/discord-api-types-v10';
						const meaning = token.canonicalReference.symbol?.meaning;
						const href = meaning === 'type' ? `${base}#${token.text}` : `${base}/${meaning}/${token.text}`;

						return (
							<Link className="text-blurple" href={href} key={idx}>
								{token.text}
							</Link>
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
		</>
	);
}
