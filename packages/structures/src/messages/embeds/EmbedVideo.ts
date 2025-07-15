import type { APIEmbedVideo } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents video data in an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class EmbedVideo<Omitted extends keyof APIEmbedVideo | '' = ''> extends Structure<APIEmbedVideo, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIEmbedVideo, Omitted>) {
		super(data);
	}

	public get height() {
		return this[kData].height;
	}

	public get width() {
		return this[kData].width;
	}

	public get proxyUrl() {
		return this[kData].proxy_url;
	}

	public get url() {
		return this[kData].url;
	}
}
