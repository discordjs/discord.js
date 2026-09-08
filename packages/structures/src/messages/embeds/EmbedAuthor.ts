import type { APIEmbedAuthor } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents author data in an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class EmbedAuthor<Omitted extends keyof APIEmbedAuthor | '' = ''> extends Structure<APIEmbedAuthor, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIEmbedAuthor, Omitted>) {
		super(data);
	}

	/**
	 * The name of the author
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The URL of author icon
	 */
	public get iconURL() {
		return this[kData].icon_url;
	}

	/**
	 * A proxied URL of author icon
	 */
	public get proxyIconURL() {
		return this[kData].proxy_icon_url;
	}

	/**
	 * The URL of the author
	 */
	public get url() {
		return this[kData].url;
	}
}
