import type { APIEmbedProvider } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents provider data in an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class EmbedProvider<Omitted extends keyof APIEmbedProvider | '' = ''> extends Structure<
	APIEmbedProvider,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIEmbedProvider, Omitted>) {
		super(data);
	}

	/**
	 * The name of the provider
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The URL of the provider
	 */
	public get url() {
		return this[kData].url;
	}
}
