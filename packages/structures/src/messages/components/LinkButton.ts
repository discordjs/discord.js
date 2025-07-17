import type { APIButtonComponentWithURL, ButtonStyle } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import { NonPremiumButton } from './NonPremiumButton.js';

/**
 * Represents a button linking to an URL on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class LinkButton<Omitted extends keyof APIButtonComponentWithURL | '' = ''> extends NonPremiumButton<
	ButtonStyle.Link,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIButtonComponentWithURL, Omitted>) {
		super(data);
	}

	public get url() {
		return this[kData].url;
	}
}
