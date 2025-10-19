import type { APIUnfurledMediaItem } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

// TODO: add `flags` as a BitField class and appropriate getter, once it gets properly documented

/**
 * Represents a media  item in a component on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class UnfurledMediaItem<Omitted extends keyof APIUnfurledMediaItem | '' = ''> extends Structure<
	APIUnfurledMediaItem,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each UnfurledMediaItem.
	 */
	public static override readonly DataTemplate: Partial<APIUnfurledMediaItem> = {};

	/**
	 * @param data - The raw data received from the API for the unfurled media item
	 */
	public constructor(data: Partialize<APIUnfurledMediaItem, Omitted>) {
		super(data);
	}

	/**
	 * The id of the uploaded attachment
	 */
	public get attachmentId() {
		return this[kData].attachment_id;
	}

	/**
	 * The media type of the content
	 */
	public get contentType() {
		return this[kData].content_type;
	}

	/**
	 * The height of the media item (if image)
	 */
	public get height() {
		return this[kData].height;
	}

	/**
	 * The proxied url of the media item
	 */
	public get proxyUrl() {
		return this[kData].proxy_url;
	}

	/**
	 * Supports arbitrary urls and attachment:// references
	 */
	public get url() {
		return this[kData].url;
	}

	/**
	 * The width of the media item (if image)
	 */
	public get width() {
		return this[kData].width;
	}
}
