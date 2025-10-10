import type { APIEmbedThumbnail } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents thumbnail data in an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class EmbedThumbnail<Omitted extends keyof APIEmbedThumbnail | '' = ''> extends Structure<
	APIEmbedThumbnail,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIEmbedThumbnail, Omitted>) {
		super(data);
	}

	/**
	 * The height of the thumbnail
	 */
	public get height() {
		return this[kData].height;
	}

	/**
	 * The width of the thumnail
	 */
	public get width() {
		return this[kData].width;
	}

	/**
	 * A proxied url of the thumbnail
	 */
	public get proxyUrl() {
		return this[kData].proxy_url;
	}

	/**
	 * The source url of the thumbnail
	 */
	public get url() {
		return this[kData].url;
	}
}
