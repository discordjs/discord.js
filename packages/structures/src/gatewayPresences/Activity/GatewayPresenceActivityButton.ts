import type { GatewayActivityButton } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any activity button on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GatewayPresenceActivityButton<Omitted extends keyof GatewayActivityButton | '' = ''> extends Structure<
	GatewayActivityButton,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each activity button
	 */
	public static override readonly DataTemplate: Partial<GatewayActivityButton> = {};

	/**
	 * @param data - The raw data received from the API for the activity button
	 */
	public constructor(data: Partialize<GatewayActivityButton, Omitted>) {
		super(data);
	}

	/**
	 * Text shown on the button (1-32 characters)
	 */
	public get label() {
		return this[kData].label;
	}

	/**
	 * URL opened when clicking the button (1-512 characters)
	 */
	public get url() {
		return this[kData].url;
	}
}
