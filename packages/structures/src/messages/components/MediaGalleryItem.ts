import type { APIMediaGalleryItem } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents an item in a media gallery on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `UnfurledMediaItem` which needs to be instantiated and stored by an extending class using it
 */
export class MediaGalleryItem<Omitted extends keyof APIMediaGalleryItem | '' = ''> extends Structure<
	APIMediaGalleryItem,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each MediaGalleryItem.
	 */
	public static override readonly DataTemplate: Partial<APIMediaGalleryItem> = {};

	/**
	 * @param data - The raw data received from the API for the media gallery item
	 */
	public constructor(data: Partialize<APIMediaGalleryItem, Omitted>) {
		super(data);
	}

	/**
	 * Alt text for the media
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * Whether the media should be a spoiler (or blurred out)
	 */
	public get spoiler() {
		return this[kData].spoiler;
	}
}
