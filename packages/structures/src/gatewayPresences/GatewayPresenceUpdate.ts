// import { DiscordSnowflake } from '@sapphire/snowflake';
import type { GatewayPresenceUpdate as APIGatewayPresenceUpdate } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
// import { kData } from '../utils/symbols.js';
// import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';
/**
 * @todo
 */
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
}
