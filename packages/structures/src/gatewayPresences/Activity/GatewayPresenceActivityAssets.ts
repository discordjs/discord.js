// import { DiscordSnowflake } from '@sapphire/snowflake';
import type { GatewayActivityAssets } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
// import { kData } from '../../utils/symbols.js';
// import { isIdSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';
/**
 * @todo
 */
/**
 * Represents any activity assets on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GatewayPresenceActivityAssets<Omitted extends keyof GatewayActivityAssets | '' = ''> extends Structure<
	GatewayActivityAssets,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each activity assets
	 */
	public static override readonly DataTemplate: Partial<GatewayActivityAssets> = {};

	/**
	 * @param data - The raw data received from the API for the activity assets
	 */
	public constructor(data: Partialize<GatewayActivityAssets, Omitted>) {
		super(data);
	}
}
