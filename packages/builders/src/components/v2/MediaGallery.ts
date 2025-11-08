/* eslint-disable jsdoc/check-param-names */

import type { APIMediaGalleryComponent, APIMediaGalleryItem } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { ComponentBuilder } from '../Component.js';
import { resolveBuilder } from '../Components.js';
import { assertReturnOfBuilder, validateComponentArray } from './Assertions.js';
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
	 * @param data - The API data to create this media gallery with
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
		...items: RestOrArray<
			APIMediaGalleryItem | MediaGalleryItemBuilder | ((builder: MediaGalleryItemBuilder) => MediaGalleryItemBuilder)
		>
	) {
		this.items.push(
			...normalizeArray(items).map((input) => {
				const result = resolveBuilder(input, MediaGalleryItemBuilder);

				assertReturnOfBuilder(result, MediaGalleryItemBuilder);
				return result;
			}),
		);
		return this;
	}

	/**
	 * Removes, replaces, or inserts media gallery items for this media gallery.
	 *
	 * @param index - The index to start removing, replacing or inserting items
	 * @param deleteCount - The amount of items to remove
	 * @param items - The items to insert
	 */
	public spliceItems(
		index: number,
		deleteCount: number,
		...items: RestOrArray<
			APIMediaGalleryItem | MediaGalleryItemBuilder | ((builder: MediaGalleryItemBuilder) => MediaGalleryItemBuilder)
		>
	) {
		this.items.splice(
			index,
			deleteCount,
			...normalizeArray(items).map((input) => {
				const result = resolveBuilder(input, MediaGalleryItemBuilder);

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
		validateComponentArray(this.items, 1, 10, MediaGalleryItemBuilder);
		return {
			...this.data,
			items: this.items.map((item) => item.toJSON()),
		} as APIMediaGalleryComponent;
	}
}
