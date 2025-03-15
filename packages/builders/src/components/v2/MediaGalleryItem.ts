import type { JSONEncodable } from '@discordjs/util';
import type { APIMediaGalleryItem } from 'discord-api-types/v10';
import { descriptionPredicate, spoilerPredicate, unfurledMediaItemPredicate } from './Assertions';

export class MediaGalleryItemBuilder implements JSONEncodable<APIMediaGalleryItem> {
	/**
	 * The API data associated with this media gallery item.
	 */
	public readonly data: Partial<APIMediaGalleryItem>;

	/**
	 * Creates a new media gallery item from API data.
	 *
	 * @param data - The API data to create this media gallery item with
	 * @example
	 * Creating a media gallery item from an API data object:
	 * ```ts
	 * const item = new MediaGalleryItemBuilder({
	 * 	description: "Some text here",
	 * 	media: {
	 * 		url: 'https://cdn.discordapp.com/embed/avatars/2.png',
	 * 	},
	 * });
	 * ```
	 * @example
	 * Creating a media gallery item using setters and API data:
	 * ```ts
	 * const item = new MediaGalleryItemBuilder({
	 * 	media: {
	 * 		url: 'https://cdn.discordapp.com/embed/avatars/5.png',
	 * 	},
	 * })
	 * 	.setDescription("alt text");
	 * ```
	 */
	public constructor(data: Partial<APIMediaGalleryItem> = {}) {
		this.data = data;
	}

	/**
	 * Sets the description of this media gallery item.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description: string) {
		this.data.description = descriptionPredicate.parse(description);
		return this;
	}

	/**
	 * Clears the description of this media gallery item.
	 */
	public clearDescription() {
		this.data.description = undefined;
		return this;
	}

	/**
	 * Sets the spoiler status of this media gallery item.
	 *
	 * @param spoiler - The spoiler status to use
	 */
	public setSpoiler(spoiler = true) {
		this.data.spoiler = spoilerPredicate.parse(spoiler);
		return this;
	}

	/**
	 * Sets the media URL of this media gallery item.
	 *
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		this.data.media = unfurledMediaItemPredicate.parse({ url });
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
	public toJSON(): APIMediaGalleryItem {
		unfurledMediaItemPredicate.parse(this.data.media);

		return { ...this.data } as APIMediaGalleryItem;
	}
}
