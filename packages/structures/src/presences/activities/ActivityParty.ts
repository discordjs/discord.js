import type { GatewayActivityParty } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import { isArrayFieldSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any activity party on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ActivityParty<Omitted extends keyof GatewayActivityParty | '' = ''> extends Structure<
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
	 *
	 * @remarks This is an application-defined id and is not a Discord snowflake.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The current size of the party
	 */
	public get currentSize() {
		const array = this[kData].size as number[];

		return array ? (isArrayFieldSet(array, 0, 'number') ? array[0] : null) : null;
	}

	/**
	 * The maximum size of the party
	 */
	public get maximumSize() {
		const array = this[kData].size as number[];

		return array ? (isArrayFieldSet(array, 1, 'number') ? array[1] : null) : null;
	}
}
