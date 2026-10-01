import type { APIUnfurledMediaItem, UnfurledMediaItemFlags } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { UnfurledMediaItemFlagsBitField } from '../../bitfields/UnfurledMediaItemFlagsBitField.js';
import { kData } from '../../utils/symbols.js';
import { isFieldSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents a media item in a component on a message.
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
	 * Unfurled media item flags combined as a bitfield
	 */
	public get flags() {
		return isFieldSet(this[kData], 'flags', 'number')
			? new UnfurledMediaItemFlagsBitField(this[kData].flags as UnfurledMediaItemFlags)
			: null;
	}

	/**
	 * The height of the media item (if image or video)
	 */
	public get height() {
		return this[kData].height;
	}

	/**
	 * ThumbHash placeholder (if image or video)
	 */
	public get placeholder() {
		return this[kData].placeholder;
	}

	/**
	 * Version of the placeholder (if image or video)
	 */
	public get placeholderVersion() {
		return this[kData].placeholder_version;
	}

	/**
	 * The proxied URL of the media item
	 */
	public get proxyURL() {
		return this[kData].proxy_url;
	}

	/**
	 * Supports arbitrary URLs and `attachment://<filename>` references
	 */
	public get url() {
		return this[kData].url;
	}

	/**
	 * The width of the media item (if image or video)
	 */
	public get width() {
		return this[kData].width;
	}
}
