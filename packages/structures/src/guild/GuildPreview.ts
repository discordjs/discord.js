import { DiscordSnowflake } from '@sapphire/snowflake';
import {
	CDNRoutes,
	ImageFormat,
	RouteBases,
	type APIGuildPreview,
	type GuildDiscoverySplashFormat,
	type GuildIconFormat,
	type GuildSplashFormat,
} from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isFieldSet, isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a guild preview on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Intentionally does not export `emojis` or `stickers`,
 *  so extending classes can map each array to `Emoji[]` and `Sticker[]` respectively.
 */
export class GuildPreview<Omitted extends keyof APIGuildPreview | '' = ''> extends Structure<APIGuildPreview, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each preview.
	 */
	public static override readonly DataTemplate: Partial<APIGuildPreview> = {};

	/**
	 * @param data - The raw data from the API for the guild preview.
	 */
	public constructor(data: Partialize<APIGuildPreview, Omitted>) {
		super(data);
	}

	/**
	 * The id of the guild.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the guild.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The icon hash of the guild.
	 *
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
	 */
	public get icon() {
		return this[kData].icon;
	}

	/**
	 * The splash hash of the guild.
	 *
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
	 */
	public get splash() {
		return this[kData].splash;
	}

	/**
	 * The discovery splash hash of the guild. Only present for guilds with the "DISCOVERABLE" feature.
	 *
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
	 */
	public get discoverySplash() {
		return this[kData].discovery_splash;
	}

	/**
	 *et the URL to the guild icon.
	 *
	 *param format - the file format to use
	 */
	public iconURL(format: GuildIconFormat = ImageFormat.WebP) {
		return isIdSet(this[kData].id) && isFieldSet(this[kData], 'icon', 'string')
			? `${RouteBases.cdn}${CDNRoutes.guildIcon(this[kData].id.toString(), this[kData].icon, format)}`
			: null;
	}

	/**
	 * Get the URL to the guild discovery splash.
	 *
	 * @param format - the file format to use
	 */
	public discoverySplashURL(format: GuildDiscoverySplashFormat = ImageFormat.WebP) {
		return isIdSet(this[kData].id) && isFieldSet(this[kData], 'discovery_splash', 'string')
			? `${RouteBases.cdn}${CDNRoutes.guildDiscoverySplash(this[kData].id.toString(), this[kData].discovery_splash, format)}`
			: null;
	}

	/**
	 * Get the URL to the guild splash.
	 *
	 * @param format - the file format to use
	 */
	public splashURL(format: GuildSplashFormat = ImageFormat.WebP) {
		return isIdSet(this[kData].id) && isFieldSet(this[kData], 'splash', 'string')
			? `${RouteBases.cdn}${CDNRoutes.guildSplash(this[kData].id.toString(), this[kData].splash, format)}`
			: null;
	}

	/**
	 * Approximate number of members in this guild.
	 */
	public get approximateMemberCount() {
		return this[kData].approximate_member_count;
	}

	/**
	 * Approximate number of non-offline members in this guild.
	 */
	public get approximatePresenceCount() {
		return this[kData].approximate_presence_count;
	}

	/**
	 * The description for the guild.
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The timestamp the guild was created at.
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the guild was created at.
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
