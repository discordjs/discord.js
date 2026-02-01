import type { GatewayPresenceUpdateData as APIGatewayPresenceUpdate } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any presence update on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GatewayPresenceUpdate<Omitted extends keyof APIGatewayPresenceUpdate | '' = ''> extends Structure<
	APIGatewayPresenceUpdate,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each presence update
	 */
	public static override readonly DataTemplate: Partial<APIGatewayPresenceUpdate> = {};

	/**
	 * @param data - The raw data received from the API for the presence update
	 */
	public constructor(data: Partialize<APIGatewayPresenceUpdate, Omitted>) {
		super(data);
	}

	/**
	 * Unix timestamp (in milliseconds) of when the client went idle, or null if the client is not idle
	 */
	public get sinceTimestamp() {
		return this[kData].since;
	}

	/**
	 * Time of when the client went idle, or null if the client is not idle
	 *
	 * @todo [!!!!] - does this name make sense? I didn't think `sinceAt` would sound right. Is it
	 * clear enough that this returns a Date object?
	 */
	public get since() {
		const timestamp = this.sinceTimestamp;

		return timestamp ? new Date(timestamp as number) : null;
	}

	/**
	 * User's new status
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#update-presence-status-types}
	 */
	public get status() {
		return this[kData].status;
	}

	/**
	 * Whether the user is AFK
	 */
	public get afk() {
		return this[kData].afk;
	}
}
