import type { APIMessageActivity } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

export class MessageActivity<Omitted extends keyof APIMessageActivity | '' = ''> extends Structure<
	APIMessageActivity,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each MessageActivity.
	 */
	public static override readonly DataTemplate: Partial<APIMessageActivity> = {};

	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIMessageActivity, Omitted>) {
		super(data);
	}

	/**
	 * The party id from a Rich Presence event
	 */
	public get partyId() {
		return this[kData].party_id;
	}

	/**
	 * The type of message activity
	 */
	public get type() {
		return this[kData].type;
	}
}
