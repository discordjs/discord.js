import type { JSONEncodable } from '@discordjs/util';
import type { APIMediaGalleryItem } from 'discord-api-types/v10';
import { descriptionPredicate, spoilerPredicate, unfurledMediaItemPredicate } from './Assertions';

export class MediaGalleryItemBuilder implements JSONEncodable<APIMediaGalleryItem> {
	/**
	 * The API data associated with this component.
	 */
	public readonly data: Partial<APIMediaGalleryItem>;

	/**
	 * Constructs a new kind of component.
	 *
	 * @param data - The data to construct a component out of
	 */
	public constructor(data: Partial<APIMediaGalleryItem> = {}) {
		this.data = data;
	}

	/**
	 * Sets the description of this media gallery item.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description?: string | undefined) {
		this.data.description = descriptionPredicate.parse(description);
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
