// import { DiscordSnowflake } from '@sapphire/snowflake';
import type { GatewayActivityTimestamps } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
// import { isIdSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any activity timestamp on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GatewayPresenceActivityTimestamps<
	Omitted extends keyof GatewayActivityTimestamps | '' = '',
> extends Structure<GatewayActivityTimestamps, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each activity timestamp
	 */
	public static override readonly DataTemplate: Partial<GatewayActivityTimestamps> = {};

	/**
	 * @param data - The raw data received from the API for the activity timestamp
	 */
	public constructor(data: Partialize<GatewayActivityTimestamps, Omitted>) {
		super(data);
	}

	/**
	 * Unix time (in milliseconds) of when the activity started.
	 */
	public get start() {
		return this[kData].start;
	}

	/**
	 * Unix time (in milliseconds) of when the activity ends.
	 */
	public get end() {
		return this[kData].end;
	}
}
