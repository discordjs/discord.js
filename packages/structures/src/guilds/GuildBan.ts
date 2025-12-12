import type { APIBan } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a ban on a guild.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `User`, which needs to be instantiated and stored by an extending class using it
 */
export abstract class GuildBan<Omitted extends keyof APIBan | '' = ''> extends Structure<APIBan, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each GuildBan
	 */
	public static override readonly DataTemplate: Partial<APIBan> = {};

	/**
	 * @param data - The raw data received from the API for the guild ban
	 */
	public constructor(data: Partialize<APIBan, Omitted>) {
		super(data);
	}

	/**
	 * The reason for the ban
	 */
	public get reason() {
		return this[kData].reason;
	}
}
