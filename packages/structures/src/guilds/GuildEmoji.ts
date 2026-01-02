import type { APIEmoji } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a guild emoji.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `User`, which needs to be instantiated and stored by an extending class using it
 */
export abstract class GuildEmoji<Omitted extends keyof APIEmoji | '' = ''> extends Structure<APIEmoji, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each GuildEmoji
	 */
	public static override readonly DataTemplate: Partial<APIEmoji> = {};

	/**
	 * @param data - The raw data received from the API for the guild emoji
	 */
	public constructor(data: Partialize<APIEmoji, Omitted>) {
		super(data);
	}

	/**
	 * The emoji id
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The emoji name
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * Roles allowed to use this emoji
	 */
	public get roles() {
		return this[kData].roles;
	}

	/**
	 * Whether this emoji must be wrapped in colons
	 */
	public get requireColons() {
		return this[kData].require_colons;
	}

	/**
	 * Whether this emoji is managed
	 */
	public get managed() {
		return this[kData].managed;
	}

	/**
	 * Whether this emoji is animated
	 */
	public get animated() {
		return this[kData].animated;
	}

	/**
	 * Whether this emoji can be used, may be false due to loss of Server Boosts
	 */
	public get available() {
		return this[kData].available;
	}
}
