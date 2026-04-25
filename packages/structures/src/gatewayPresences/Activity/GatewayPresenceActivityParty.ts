import { DiscordSnowflake } from '@sapphire/snowflake';
import type { GatewayActivityParty } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import { isIdSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any activity party on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GatewayPresenceActivityParty<Omitted extends keyof GatewayActivityParty | '' = ''> extends Structure<
	GatewayActivityParty,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each activity party.
	 */
	public static override readonly DataTemplate: Partial<GatewayActivityParty> = {};

	/**
	 * @param data - The raw data received from the API for the activity party.
	 */
	public constructor(data: Partialize<GatewayActivityParty, Omitted>) {
		super(data);
	}

	/**
	 * The id of the party.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * Used to show the party's current and maximum size.
	 *
	 * @remarks array of two integers (`current_size`, `max_size`)
	 */
	public get size() {
		return this[kData].size;
	}

	/**
	 * The timestamp the activity party was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the activity party was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
