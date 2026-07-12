import type { APIPollResults } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents the results of a poll on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `PollAnswerCount` which need to be instantiated and stored by an extending class using it
 */
export class PollResults<Omitted extends keyof APIPollResults | '' = ''> extends Structure<APIPollResults, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each PollResults.
	 */
	public static override DataTemplate: Partial<APIPollResults> = {};

	/**
	 * @param data - The raw data received from the API for the poll results
	 */
	public constructor(data: Partialize<APIPollResults, Omitted>) {
		super(data);
	}

	/**
	 * Whether the votes have been precisely counted
	 */
	public get isFinalized() {
		return this[kData].is_finalized;
	}
}
