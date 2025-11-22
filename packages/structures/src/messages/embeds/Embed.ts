import type { APIEmbed } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { dateToDiscordISOTimestamp } from '../../utils/optimization.js';
import { kCreatedTimestamp, kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents an embed on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `EmbedAuthor`, `EmbedFooter`, `EmbedField`, `EmbedImage`, `EmbedThumbnail`, `EmbedProvider`, `EmbedVideo` which need to be instantiated and stored by an extending class using it
 */
export class Embed<Omitted extends keyof APIEmbed | '' = ''> extends Structure<APIEmbed, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Embed.
	 */
	public static override readonly DataTemplate: Partial<APIEmbed> = {
		set timestamp(_: string) {},
	};

	protected [kCreatedTimestamp]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIEmbed, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 *
	 * @internal
	 */
	protected override optimizeData(data: Partial<APIEmbed>) {
		if (data.timestamp) {
			this[kCreatedTimestamp] = Date.parse(data.timestamp);
		}
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
		return this[kCreatedTimestamp];
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

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();
		if (this[kCreatedTimestamp]) {
			clone.timestamp = dateToDiscordISOTimestamp(new Date(this[kCreatedTimestamp]));
		}

		return clone;
	}
}
