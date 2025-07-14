import type { APIUnfurledMediaItem } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents an item in a media gallery on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `UnfurledMediaItem` which needs to be instantiated and stored by an extending class using it
 */
export class UnfurledMediaItem<Omitted extends keyof APIUnfurledMediaItem | '' = ''> extends Structure<
	APIUnfurledMediaItem,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the connection
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

	public get flags() {
		// TODO: replace with a BitField class, if this gets properly documented
		return this[kData].flags;
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
