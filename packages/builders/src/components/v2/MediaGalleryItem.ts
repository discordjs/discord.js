import type { APIMediaGalleryItem } from 'discord-api-types/v10';
import type { JSONEncodable } from '../../../../util/dist';
import { validate } from '../../util/validation';
import { mediaGalleryItemPredicate } from './Assertions';

export class MediaGalleryItemBuilder implements JSONEncodable<APIMediaGalleryItem> {
	private readonly data: Partial<APIMediaGalleryItem>;

	public constructor(data: Partial<APIMediaGalleryItem> = {}) {
		this.data = {
			...structuredClone(data),
		};
	}

	/**
	 * Sets the source URL of this media gallery item.
	 *
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		this.data.media = { url };
		return this;
	}

	/**
	 * Sets the description of this thumbnail.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description: string) {
		this.data.description = description;
		return this;
	}

	/**
	 * Clears the description of this thumbnail.
	 */
	public clearDescription() {
		this.data.description = undefined;
		return this;
	}

	/**
	 * Sets the spoiler status of this thumbnail.
	 *
	 * @param spoiler - The spoiler status to use
	 */
	public setSpoiler(spoiler: boolean) {
		this.data.spoiler = spoiler;
		return this;
	}

	/**
	 * Transforms this object to its JSON format
	 */
	public toJSON(validationOverride?: boolean): APIMediaGalleryItem {
		const clone = structuredClone(this.data);
		validate(mediaGalleryItemPredicate, clone, validationOverride);

		return clone as APIMediaGalleryItem;
	}
}
