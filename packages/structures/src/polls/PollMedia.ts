import type { APIPollMedia } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a field of a poll on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `Emoji` which need to be instantiated and stored by an extending class using it
 */
export class PollMedia<Omitted extends keyof APIPollMedia | '' = ''> extends Structure<APIPollMedia, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each PollMedia.
	 */
	public static override DataTemplate: Partial<APIPollMedia> = {};

	/**
	 * @param data - The raw data received from the API for the poll media
	 */
	public constructor(data: Partialize<APIPollMedia, Omitted>) {
		super(data);
	}

	/**
	 * The text of the poll field
	 */
	public get text() {
		return this[kData].text;
	}
}
