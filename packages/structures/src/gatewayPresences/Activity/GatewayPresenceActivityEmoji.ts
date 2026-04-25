import { DiscordSnowflake } from '@sapphire/snowflake';
import type { EmojiFormat, CDNRoutes, ImageFormat, RouteBases, type GatewayActivityEmoji } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import { isIdSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any activity emoji on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GatewayPresenceActivityEmoji<Omitted extends keyof GatewayActivityEmoji | '' = ''> extends Structure<
	GatewayActivityEmoji,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each activity emoji
	 */
	public static override readonly DataTemplate: Partial<GatewayActivityEmoji> = {};

	/**
	 * @param data - The raw data received from the API for the activity emoji
	 */
	public constructor(data: Partialize<GatewayActivityEmoji, Omitted>) {
		super(data);
	}

	/**
	 * The id of the emoji
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the emoji
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * Whether the emoji is animated
	 */
	public get animated() {
		return this[kData].animated;
	}

	/**
	 * The timestamp the activity emoji was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the activity emoji was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}

	/**
	 * Retrieve a URL for this activity emoji
	 *
	 * @param format - The format the emoji should be returned in
	 * @returns the URL for this activity emoji
	 */
	public url(format: EmojiFormat = ImageFormat.WebP) {
		return isIdSet(this.id) ? `${RouteBases.cdn}${CDNRoutes.emoji(this.id.toString(), format)}` : null;
	}
}
