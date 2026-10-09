import type { APIEmbedImage, EmbedMediaFlags } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { EmbedMediaFlagsBitField } from '../../bitfields/EmbedMediaFlagsBitField.js';
import { kData } from '../../utils/symbols.js';
import { isFieldSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents image data in an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class EmbedImage<Omitted extends keyof APIEmbedImage | '' = ''> extends Structure<APIEmbedImage, Omitted> {
	/**
	 * @param data - The raw data received from the API for the embed image
	 */
	public constructor(data: Partialize<APIEmbedImage, Omitted>) {
		super(data);
	}

	/**
	 * The height of the image
	 */
	public get height() {
		return this[kData].height;
	}

	/**
	 * The width of the image
	 */
	public get width() {
		return this[kData].width;
	}

	/**
	 * A proxied URL of the image
	 */
	public get proxyURL() {
		return this[kData].proxy_url;
	}

	/**
	 * Source URL of the image
	 */
	public get url() {
		return this[kData].url;
	}

	/**
	 * The image's media type
	 */
	public get contentType() {
		return this[kData].content_type;
	}

	/**
	 * ThumbHash placeholder of the image
	 */
	public get placeholder() {
		return this[kData].placeholder;
	}

	/**
	 * Version of the placeholder
	 */
	public get placeholderVersion() {
		return this[kData].placeholder_version;
	}

	/**
	 * Description (alt text) for the image
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * Embed media flags combined as a bitfield
	 */
	public get flags() {
		return isFieldSet(this[kData], 'flags', 'number')
			? new EmbedMediaFlagsBitField(this[kData].flags as EmbedMediaFlags)
			: null;
	}
}
