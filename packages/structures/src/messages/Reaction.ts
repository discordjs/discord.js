import type { APIReaction } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kBurstColors, kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a reaction on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `Emoji`, `ReactionCountDetails` which need to be instantiated and stored by an extending class using it
 */
export class Reaction<Omitted extends keyof APIReaction | '' = ''> extends Structure<APIReaction, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Reaction.
	 */
	public static override DataTemplate: Partial<APIReaction> = {
		set burst_colors(_: string[]) {},
	};

	protected [kBurstColors]: number[] | null = null;

	/**
	 * @param data - The raw data received from the API for the reaction
	 */
	public constructor(data: Partialize<APIReaction, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 *
	 * @internal
	 */
	protected override optimizeData(data: Partial<APIReaction>) {
		if (data.burst_colors) {
			this[kBurstColors] = data.burst_colors.map((color) => Number.parseInt(color, 16));
		}
	}

	/**
	 * The amount how often this emoji has been used to react (including super reacts)
	 */
	public get count() {
		return this[kData].count;
	}

	/**
	 * Whether the current user has reacted using this emoji
	 */
	public get me() {
		return this[kData].me;
	}

	/**
	 * Whether the current user has super-reacted using this emoji
	 */
	public get meBurst() {
		return this[kData].me_burst;
	}

	/**
	 * The colors used for super reaction
	 */
	public get burstColors() {
		return this[kBurstColors];
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();
		if (this[kBurstColors]) {
			clone.burst_colors = this[kBurstColors].map((color) => `#${color.toString(16).padStart(6, '0')}`);
		}

		return clone;
	}
}
