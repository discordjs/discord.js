import { CDNRoutes, ImageFormat, RouteBases, type APISticker, type StickerFormat } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a sticker on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class Sticker<Omitted extends keyof APISticker | '' = ''> extends Structure<APISticker, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each SitckerItem.
	 */
	public static override DataTemplate: Partial<APISticker> = {};

	/**
	 * @param data - The raw data received from the API for the sticker item
	 */
	public constructor(data: Partialize<APISticker, Omitted>) {
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

	/**
	 * Whether this guild sticker can be used, may be false due to loss of Server Boosts
	 */
	public get available() {
		return this[kData].available;
	}

	/**
	 * The description of the sticker
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The autocomplete/suggestion tags for the sticker
	 */
	public get tags() {
		return this[kData].tags;
	}

	/**
	 * The type of this sticker
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * Get the URL to the sticker
	 *
	 * @param format - the file format to use
	 */
	public url(format: StickerFormat = ImageFormat.PNG) {
		return isIdSet(this[kData].id) ? `${RouteBases.cdn}${CDNRoutes.sticker(this[kData].id.toString(), format)}` : null;
	}
}
