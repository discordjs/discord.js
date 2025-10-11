import type { APIEmbed } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `EmbedAuthor`, `EmbedFooter`, `EmbedField`, `EmbedImage`, `EmbedThumbnail`, `EmbedProvider`, `EmbedVideo` which need to be instantiated and stored by an extending class using it
 */
export class Embed<Omitted extends keyof APIEmbed | '' = ''> extends Structure<APIEmbed, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIEmbed, Omitted>) {
		super(data);
	}

	/**
	 * The color code of the embed
	 */
	public get color() {
		return this[kData].color;
	}

	/**
	 * The hexadecimal version of the embed color, with a leading hash
	 */
	public get hexColor() {
		const color = this.color;
		if (typeof color !== 'number') return color;
		return `#${color.toString(16).padStart(6, '0')}`;
	}

	/**
	 * The description of the embed
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * THe title of the embed
	 */
	public get title() {
		return this[kData].title;
	}

	/**
	 * The timestamp of the embed content
	 */
	public get timestamp() {
		return this[kData].timestamp;
	}

	/**
	 * The type of embed (always "rich" for webhook embeds)
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The URL of the embed
	 */
	public get url() {
		return this[kData].url;
	}
}
