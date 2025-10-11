import type { APIReactionCountDetails } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents the usage count of a reaction on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ReactionCountDetails<Omitted extends keyof APIReactionCountDetails | '' = ''> extends Structure<
	APIReactionCountDetails,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each ReactionCountDetails.
	 */
	public static override DataTemplate: Partial<APIReactionCountDetails> = {};

	/**
	 * @param data - The raw data received from the API for the reaction count details
	 */
	public constructor(data: Partialize<APIReactionCountDetails, Omitted>) {
		super(data);
	}

	/**
	 * The amount how often this emoji has been used to react (excluding super reacts)
	 */
	public get normal() {
		return this[kData].normal;
	}

	/**
	 * The amount how often this emoji has been used to super-react
	 */
	public get burst() {
		return this[kData].burst;
	}
}
