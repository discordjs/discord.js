import type { APIMessageCall } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData, kEndedTimestamp } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

export class MessageCall<Omitted extends keyof APIMessageCall | '' = 'ended_timestamp'> extends Structure<
	APIMessageCall,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each Connection
	 */
	public static override DataTemplate: Partial<APIMessageCall> = {
		set ended_timestamp(_: string) {},
	};

	protected [kEndedTimestamp]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the connection
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
	 * The timestamp this call ended at, or `null`if it didn't end yet
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
	 * The user ids that participated in this call
	 */
	public get participants(): readonly string[] | null {
		return Array.isArray(this[kData].participants) ? this[kData].participants : null;
	}
}
