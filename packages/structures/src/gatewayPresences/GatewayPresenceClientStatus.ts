import type { GatewayPresenceClientStatus as GatewayPresenceClientStatusTypedef } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any client status on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GatewayPresenceClientStatus<
	Omitted extends keyof GatewayPresenceClientStatusTypedef | '' = '',
> extends Structure<GatewayPresenceClientStatusTypedef, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each client status
	 */
	public static override readonly DataTemplate: Partial<GatewayPresenceClientStatusTypedef> = {};

	/**
	 * @param data - The raw data received from the API for the client status
	 */
	public constructor(data: Partialize<GatewayPresenceClientStatusTypedef, Omitted>) {
		super(data);
	}

	/**
	 * User's status set for an active desktop (Windows, Linux, Mac) application session
	 */
	public get desktop() {
		return this[kData].desktop;
	}

	/**
	 * User's status set for an active mobile (iOS, Android) application session
	 */
	public get mobile() {
		return this[kData].mobile;
	}

	/**
	 * User's status set for an active web (browser, bot user) application session
	 */
	public get web() {
		return this[kData].web;
	}
}
