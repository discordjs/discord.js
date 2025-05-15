import { type APIMediaGalleryItem, type APIMediaGalleryComponent, ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { mediaGalleryPredicate } from './Assertions.js';
import { MediaGalleryItemBuilder } from './MediaGalleryItem.js';

export interface MediaGalleryBuilderData extends Partial<Omit<APIMediaGalleryComponent, 'items'>> {
	items: MediaGalleryItemBuilder[];
}

/**
 * A builder that creates API-compatible JSON data for media galleries.
 */
export class MediaGalleryBuilder extends ComponentBuilder<APIMediaGalleryComponent> {
	/**
	 * @internal
	 */
	protected readonly data: MediaGalleryBuilderData;

	/**
	 * The items in this media gallery.
	 */
	public get items(): readonly MediaGalleryItemBuilder[] {
		return this.data.items;
	}

	/**
	 * Creates a new media gallery.
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
	public constructor(data: Partial<APIMediaGalleryComponent> = {}) {
		super();

		const { items = [], ...rest } = data;

		this.data = {
			...structuredClone(rest),
			items: items.map((item) => new MediaGalleryItemBuilder(item)),
			type: ComponentType.MediaGallery,
		};
	}

	/**
	 * Adds a media gallery item to this media gallery.
	 *
	 * @param input - The items to add
	 */
	public addItems(
		...input: RestOrArray<
			APIMediaGalleryItem | MediaGalleryItemBuilder | ((builder: MediaGalleryItemBuilder) => MediaGalleryItemBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((item) => resolveBuilder(item, MediaGalleryItemBuilder));

		this.data.items.push(...resolved);
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
		const normalized = normalizeArray(items);
		const resolved = normalized.map((item) => resolveBuilder(item, MediaGalleryItemBuilder));

		this.data.items.splice(index, deleteCount, ...resolved);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIMediaGalleryComponent {
		const { items, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			items: items.map((item) => item.toJSON(false)),
		};

		validate(mediaGalleryPredicate, data, validationOverride);

		return data as APIMediaGalleryComponent;
	}
}
