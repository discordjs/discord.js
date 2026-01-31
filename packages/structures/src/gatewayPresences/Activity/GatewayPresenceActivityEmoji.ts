// import { DiscordSnowflake } from '@sapphire/snowflake';
import type { GatewayActivityTimestamps } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
// import { kData } from '../../utils/symbols.js';
// import { isIdSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';
/**
 * @todo
 */
/**
 * Represents any activity emoji on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GatewayPresenceActivityEmoji<Omitted extends keyof GatewayActivityTimestamps | '' = ''> extends Structure<
	GatewayActivityTimestamps,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each activity emoji
	 */
	public static override readonly DataTemplate: Partial<GatewayActivityTimestamps> = {};

	/**
	 * @param data - The raw data received from the API for the activity emoji
	 */
	public constructor(data: Partialize<GatewayActivityTimestamps, Omitted>) {
		super(data);
	}
}
