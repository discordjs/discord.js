import type { APIPollAnswerCount } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents the counts of answers to a poll on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class PollAnswerCount<Omitted extends keyof APIPollAnswerCount | '' = ''> extends Structure<
	APIPollAnswerCount,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each PollAnswerCount.
	 */
	public static override DataTemplate: Partial<APIPollAnswerCount> = {};

	/**
	 * @param data - The raw data received from the API for the poll answer count
	 */
	public constructor(data: Partialize<APIPollAnswerCount, Omitted>) {
		super(data);
	}

	/**
	 * The id of the poll answer
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The number of votes for this answer
	 */
	public get count() {
		return this[kData].count;
	}

	/**
	 * Whether the current user voted for this answer
	 */
	public get meVoted() {
		return this[kData].me_voted;
	}
}
