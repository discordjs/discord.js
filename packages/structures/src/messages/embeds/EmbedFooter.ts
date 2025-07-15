import type { APIEmbedFooter } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents footer data in an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class EmbedFooter<Omitted extends keyof APIEmbedFooter | '' = ''> extends Structure<APIEmbedFooter, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIEmbedFooter, Omitted>) {
		super(data);
	}

	public get text() {
		return this[kData].text;
	}

	public get iconUrl() {
		return this[kData].icon_url;
	}

	public get proxIconUrl() {
		return this[kData].proxy_icon_url;
	}
}
