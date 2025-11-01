import type { APIThumbnailComponent } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import { Component } from './Component.js';

/**
 * Represents a thumbnail component on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `UnfurledMediaItem` which needs to be instantiated and stored by an extending class using it
 */
export class ThumbnailComponent<Omitted extends keyof APIThumbnailComponent | '' = ''> extends Component<
	APIThumbnailComponent,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each ThumbnailComponent.
	 */
	public static override readonly DataTemplate: Partial<APIThumbnailComponent> = {};

	/**
	 * @param data - The raw data received from the API for the thumbnail
	 */
	public constructor(data: Partialize<APIThumbnailComponent, Omitted>) {
		super(data);
	}

	/**
	 * Alt text for the media
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * Whether the thumbnail should be a spoiler (or blurred out)
	 */
	public get spoiler() {
		return this[kData].spoiler;
	}
}
