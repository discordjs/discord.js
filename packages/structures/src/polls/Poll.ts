import type { APIPoll } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { dateToDiscordISOTimestamp } from '../utils/optimization.js';
import { kData, kExpiresTimestamp, kPatch } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a poll on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `PollMedia`, `PollAnswer`, `PollResults` which need to be instantiated and stored by an extending class using it
 */
export class Poll<Omitted extends keyof APIPoll | '' = ''> extends Structure<APIPoll, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Poll.
	 */
	public static override DataTemplate: Partial<APIPoll> = {
		set expiry(_: string) {},
	};

	/**
	 * Optimized storage of {@link discord-api-types/v10#(APIPoll:interface).expiry}
	 *
	 * @internal
	 */
	protected [kExpiresTimestamp]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the poll
	 */
	public constructor(data: Partialize<APIPoll, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.[kPatch]}
	 *
	 * @internal
	 */
	public override [kPatch](data: Partial<APIPoll>) {
		super[kPatch](data);
		return this;
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 *
	 * @internal
	 */
	protected override optimizeData(data: Partial<APIPoll>) {
		if (data.expiry) {
			this[kExpiresTimestamp] = Date.parse(data.expiry);
		}
	}

	/**
	 * Whether a user can select multiple answers
	 */
	public get allowMultiselect() {
		return this[kData].allow_multiselect;
	}

	/**
	 * The layout type of the poll
	 */
	public get layoutType() {
		return this[kData].layout_type;
	}

	/**
	 * The timestamp this poll will expire at
	 */
	public get expiresTimestamp() {
		return this[kExpiresTimestamp];
	}

	/**
	 * The time the poll will expire at
	 */
	public get expiresAt() {
		const expiresTimestamp = this.expiresTimestamp;
		return expiresTimestamp ? new Date(expiresTimestamp) : null;
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();
		if (this[kExpiresTimestamp]) {
			clone.expiry = dateToDiscordISOTimestamp(new Date(this[kExpiresTimestamp]));
		}

		return clone;
	}
}
