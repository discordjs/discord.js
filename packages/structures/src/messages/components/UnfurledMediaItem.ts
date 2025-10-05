import type { APIUnfurledMediaItem } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

// TODO: add `flags` as a BitField class and appropriate getter, once it gets properly documented

/**
 * Represents an item in a media gallery on a message.
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

	public get attachmentId() {
		return this[kData].attachment_id;
	}

	public get contentType() {
		return this[kData].content_type;
	}

	public get height() {
		return this[kData].height;
	}

	public get loadingState() {
		return this[kData].loading_state;
	}

	public get placeholder() {
		return this[kData].placeholder;
	}

	public get placeholderVersion() {
		return this[kData].placeholder_version;
	}

	public get proxyUrl() {
		return this[kData].proxy_url;
	}

	public get url() {
		return this[kData].url;
	}

	public get width() {
		return this[kData].width;
	}
}
