import type { APIPollAnswer } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents an answer to a poll on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `PollMedia` which need to be instantiated and stored by an extending class using it
 */
export class PollAnswer<Omitted extends keyof APIPollAnswer | '' = ''> extends Structure<APIPollAnswer, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each PollAnswer.
	 */
	public static override DataTemplate: Partial<APIPollAnswer> = {};

	/**
	 * @param data - The raw data received from the API for the poll answer
	 */
	public constructor(data: Partialize<APIPollAnswer, Omitted>) {
		super(data);
	}

	/**
	 * The id of the poll answer
	 */
	public get answerId() {
		return this[kData].answer_id;
	}
}
