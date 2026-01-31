// import { DiscordSnowflake } from '@sapphire/snowflake';
import type { GatewayActivitySecrets } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
// import { kData } from '../../utils/symbols.js';
// import { isIdSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';
/**
 * @todo
 */
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
	 * The template used for removing data from the raw data stored for each activity secrets.
	 */
	public static override readonly DataTemplate: Partial<GatewayActivitySecrets> = {};

	/**
	 * @param data - The raw data received from the API for the activity secrets.
	 */
	public constructor(data: Partialize<GatewayActivitySecrets, Omitted>) {
		super(data);
	}
}
