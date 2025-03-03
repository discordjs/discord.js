/* eslint-disable jsdoc/check-param-names */

import type { APIMediaGalleryComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { ComponentBuilder } from '../Component.js';
import { assertReturnOfBuilder } from './Assertions.js';
import { MediaGalleryItemBuilder } from './MediaGalleryItem.js';

/**
 * A builder that creates API-compatible JSON data for a container.
 */
export class MediaGalleryBuilder extends ComponentBuilder<APIMediaGalleryComponent> {
	/**
	 * The components within this container.
	 */
	public readonly items: MediaGalleryItemBuilder[];

	/**
	 * Creates a new media gallery from API data.
	 *
	 * @param data - The API data to create this container with
	 * @example
	 * Creating a media gallery from an API data object:
	 * ```ts
	 * const mediaGallery = new MediaGalleryBuilder({
	 * 	items: [
	 * 		{
	 * 			description: "Some text here",
	 * 			media: {
	 * 				url: 'https://cdn.discordapp.com/embed/avatars/2.png',
	 * 			},
	 * 		},
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating a media gallery using setters and API data:
	 * ```ts
	 * const mediaGallery = new MediaGalleryBuilder({
	 * 	items: [
	 * 		{
	 * 			description: "alt text",
	 * 			media: {
	 * 				url: 'https://cdn.discordapp.com/embed/avatars/5.png',
	 * 			},
	 * 		},
	 * 	],
	 * })
	 * 	.addItems(item2, item3);
	 * ```
	 */
	public constructor({ items, ...data }: Partial<APIMediaGalleryComponent> = {}) {
		super({ type: ComponentType.MediaGallery, ...data });
		this.items = items?.map((item) => new MediaGalleryItemBuilder(item)) ?? [];
	}

	/**
	 * Adds items to this media gallery.
	 *
	 * @param items - The items to add
	 */
	public addItems(
		...items: RestOrArray<MediaGalleryItemBuilder | ((builder: MediaGalleryItemBuilder) => MediaGalleryItemBuilder)>
	) {
		this.items.push(
			...normalizeArray(items).map((input) => {
				const result = typeof input === 'function' ? input(new MediaGalleryItemBuilder()) : input;

				assertReturnOfBuilder(result, MediaGalleryItemBuilder);
				return result;
			}),
		);
		return this;
	}

	/**
	 * Sets items for this media gallery.
	 *
	 * @param items - The items to set
	 */
	public setItems(
		...items: RestOrArray<MediaGalleryItemBuilder | ((builder: MediaGalleryItemBuilder) => MediaGalleryItemBuilder)>
	) {
		this.items.splice(
			0,
			this.items.length,
			...normalizeArray(items).map((input) => {
				const result = typeof input === 'function' ? input(new MediaGalleryItemBuilder()) : input;

				assertReturnOfBuilder(result, MediaGalleryItemBuilder);
				return result;
			}),
		);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APIMediaGalleryComponent {
		return {
			...this.data,
			items: this.items.map((item) => item.toJSON()),
		} as APIMediaGalleryComponent;
	}
}
