import type { APIMessageCall } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { dateToDiscordISOTimestamp } from '../utils/optimization.js';
import { kEndedTimestamp } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

export class MessageCall<Omitted extends keyof APIMessageCall | '' = 'ended_timestamp'> extends Structure<
	APIMessageCall,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each MessageCall
	 */
	public static override DataTemplate: Partial<APIMessageCall> = {
		set ended_timestamp(_: string) {},
	};

	protected [kEndedTimestamp]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the message call
	 */
	public constructor(data: Partialize<APIMessageCall, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 *
	 * @internal
	 */
	protected override optimizeData(data: Partial<APIMessageCall>) {
		if (data.ended_timestamp) {
			this[kEndedTimestamp] = Date.parse(data.ended_timestamp);
		}
	}

	/**
	 * The timestamp this call ended at, or `null` if it didn't end yet
	 */
	public get endedTimestamp() {
		return this[kEndedTimestamp];
	}

	/**
	 * The time the call ended at, or `null` if it didn't end yet
	 */
	public get endedAt() {
		const endedTimestamp = this.endedTimestamp;
		return endedTimestamp ? new Date(endedTimestamp) : null;
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();
		if (this[kEndedTimestamp]) {
			clone.ended_timestamp = dateToDiscordISOTimestamp(new Date(this[kEndedTimestamp]));
		}

		return clone;
	}
}
