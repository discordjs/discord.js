import type { APIBan } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { kData } from '../utils/symbols';
import type { Partialize } from '../utils/types';

/**
 * Represents a ban on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `User`, which needs to be instantiated and stored by any extending classes using it.
 */
export class Ban<Omitted extends keyof APIBan | '' = ''> extends Structure<APIBan, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each ban.
	 */
	public static override readonly DataTemplate: Partial<APIBan> = {};

	/**
	 * @param data - The raw data from the API for the ban.
	 */
	public constructor(data: Partialize<APIBan, Omitted>) {
		super(data);
	}

	/**
	 * The reason for the ban.
	 */
	public get reason() {
		return this[kData].reason;
	}
}
