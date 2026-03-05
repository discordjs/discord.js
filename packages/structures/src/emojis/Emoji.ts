import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIEmoji } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any emoji on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `User` which needs to be instantiated and stored by an extending class using it
 * @remarks intentionally does not export `roles` so that extending classes can resolve `Snowflake[]` to `Role[]`
 */
export class Emoji<Omitted extends keyof APIEmoji | '' = ''> extends Structure<APIEmoji, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each emoji
	 */
	public static override readonly DataTemplate: Partial<APIEmoji> = {};

	/**
	 * @param data - The raw data received from the API for the emoji
	 */
	public constructor(data: Partialize<APIEmoji, Omitted>) {
		super(data);
	}

	/**
	 * The emoji's id
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the emoji
	 *
	 * @remarks can be null only in reaction emoji objects
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * Whether this emoji must be wrapped in colons
	 */
	public get requireColons() {
		return this[kData].require_colons;
	}

	/**
	 * Whether the emoji is managed
	 */
	public get managed() {
		return this[kData].managed;
	}

	/**
	 * Whether the emoji is animated
	 */
	public get animated() {
		return this[kData].animated;
	}

	/**
	 * Whether the emoji can be used
	 *
	 * @remarks May be false due to loss of server boosts
	 */
	public get available() {
		return this[kData].available;
	}

	/**
	 * The timestamp the emoji was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the emoji was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
