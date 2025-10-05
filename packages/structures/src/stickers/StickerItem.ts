import type { APIStickerItem } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a sticker used on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class StickerItem<Omitted extends keyof APIStickerItem | '' = ''> extends Structure<APIStickerItem, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each SitckerItem.
	 */
	public static override DataTemplate: Partial<APIStickerItem> = {};

	/**
	 * @param data - The raw data received from the API for the sticker item
	 */
	public constructor(data: Partialize<APIStickerItem, Omitted>) {
		super(data);
	}

	/**
	 * The id of the sticker
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the sticker
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The format type of the sticker
	 */
	public get formatType() {
		return this[kData].format_type;
	}
}
