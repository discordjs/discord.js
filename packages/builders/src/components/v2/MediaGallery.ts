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

export class MediaGalleryBuilder extends ComponentBuilder<APIMediaGalleryComponent> {
	private readonly data: MediaGalleryBuilderData;

	public constructor(data: Partial<APIMediaGalleryComponent> = {}) {
		super();
		this.data = {
			items: data?.items?.map((item) => new MediaGalleryItemBuilder(item)) ?? [],
			type: ComponentType.MediaGallery,
		};
	}

	/**
	 * The items in this media gallery.
	 */
	public get items(): readonly MediaGalleryItemBuilder[] {
		return this.data.items;
	}

	/**
	 * Adds a media gallery item to this media gallery.
	 *
	 * @param input - The items to add
	 */
	public addItems(
		...input: RestOrArray<APIMediaGalleryItem | MediaGalleryItemBuilder | (() => MediaGalleryItemBuilder)>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((item) => resolveBuilder(item, MediaGalleryItemBuilder));

		this.data.items.push(...resolved);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIMediaGalleryComponent {
		const { items, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			items: items.map((item) => item.toJSON(validationOverride)),
		};

		validate(mediaGalleryPredicate, data, validationOverride);

		return data as APIMediaGalleryComponent;
	}
}
