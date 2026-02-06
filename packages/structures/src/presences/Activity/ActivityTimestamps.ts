import type { GatewayActivityTimestamps } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import { isFieldSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any activity timestamp on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ActivityTimestamps<Omitted extends keyof GatewayActivityTimestamps | '' = ''> extends Structure<
	GatewayActivityTimestamps,
	Omitted
> {
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
	public get startTimestamp() {
		return this[kData].start;
	}

	/**
	 * Time of when the activity started.
	 */
	public get startAt() {
		return isFieldSet(this[kData], 'start', 'number') ? new Date(this[kData].start) : null;
	}

	/**
	 * Unix time (in milliseconds) of when the activity ends.
	 */
	public get endTimestamp() {
		return this[kData].end;
	}

	/**
	 * Time of when the activity ended.
	 */
	public get endAt() {
		return isFieldSet(this[kData], 'end', 'number') ? new Date(this[kData].end) : null;
	}
}
