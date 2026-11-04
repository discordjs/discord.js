import type { APIActivityLocation } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents the location in which an application activity instance is running.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @see {@link https://docs.discord.com/developers/resources/application#activity-location-object}
 */
export class ActivityLocation<Omitted extends keyof APIActivityLocation | '' = ''> extends Structure<
	APIActivityLocation,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each activity location
	 */
	public static override readonly DataTemplate: Partial<APIActivityLocation> = {};

	/**
	 * @param data - The raw data received from the API for the activity location
	 */
	public constructor(data: Partialize<APIActivityLocation, Omitted>) {
		super(data);
	}

	/**
	 * The unique id of the location
	 *
	 * @remarks This is not a Discord snowflake.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The kind of location
	 *
	 * @see {@link discord-api-types/v10#ActivityLocationKind}
	 */
	public get kind() {
		return this[kData].kind;
	}

	/**
	 * The id of the channel
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The id of the guild, if present
	 */
	public get guildId() {
		return this[kData].guild_id;
	}
}
