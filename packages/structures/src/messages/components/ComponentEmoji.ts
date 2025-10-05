import type { APIMessageComponentEmoji } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

export class ComponentEmoji<Omitted extends keyof APIMessageComponentEmoji | '' = ''> extends Structure<
	APIMessageComponentEmoji,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each ComponentEmoji.
	 */
	public static override readonly DataTemplate: Partial<APIMessageComponentEmoji> = {};

	/**
	 * @param data - The raw data received from the API for the component emoji
	 */
	public constructor(data: Partialize<APIMessageComponentEmoji, Omitted>) {
		super(data);
	}

	public get id() {
		return this[kData].id;
	}

	public get name() {
		return this[kData].name;
	}

	public get animated() {
		return this[kData].animated;
	}
}
