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

	public get color() {
		return this[kData].color;
	}

	public get description() {
		return this[kData].description;
	}

	public get title() {
		return this[kData].title;
	}

	public get timestamp() {
		return this[kData].timestamp;
	}

	public get type() {
		return this[kData].type;
	}

	public get url() {
		return this[kData].url;
	}
}
