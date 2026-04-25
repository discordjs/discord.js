import type { GatewayActivitySecrets } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any activity secrets on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GatewayPresenceActivitySecrets<Omitted extends keyof GatewayActivitySecrets | '' = ''> extends Structure<
	GatewayActivitySecrets,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each activity's secrets.
	 */
	public static override readonly DataTemplate: Partial<GatewayActivitySecrets> = {};

	/**
	 * @param data - The raw data received from the API for the activity's secrets.
	 */
	public constructor(data: Partialize<GatewayActivitySecrets, Omitted>) {
		super(data);
	}

	/**
	 * Secret for joining a party.
	 */
	public get join() {
		return this[kData].join;
	}

	/**
	 * Secret for spectating a game.
	 */
	public get spectate() {
		return this[kData].spectate;
	}

	/**
	 * Secret for a specific instanced match
	 */
	public get match() {
		return this[kData].match;
	}
}
