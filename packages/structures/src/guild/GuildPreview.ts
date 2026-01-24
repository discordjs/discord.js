import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIGuildPreview } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { kData } from '../utils/symbols';
import { isIdSet } from '../utils/type-guards';
import type { Partialize } from '../utils/types';

/**
 * Represents a guild preview on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Intentionally does not export `emojis`, `features`, or `stickers`,
 *  so extending classes can map each array to `Emoji[]`, `GuildFeature[]`, and `Sticker[]` respectively.
 */
export class GuildPreview<Omitted extends keyof APIGuildPreview | ''> extends Structure<APIGuildPreview, Omitted> {
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
	 * @see https://discord.com/developers/docs/reference#image-formatting
	 */
	public get icon() {
		return this[kData].icon;
	}

	/**
	 * The splash hash of the guild.
	 *
	 * @see https://discord.com/developers/docs/reference#image-formatting
	 */
	public get splash() {
		return this[kData].splash;
	}

	/**
	 * The discovery splash hash of the guild. Only present for guilds with the "DISCOVERABLE" feature.
	 *
	 * @see https://discord.com/developers/docs/reference#image-formatting
	 */
	public get discoverySplash() {
		return this[kData].discovery_splash;
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
