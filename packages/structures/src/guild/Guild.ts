import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIGuild, GuildSystemChannelFlags } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { GuildSystemChannelFlagsBitField } from '../bitfields/GuildSystemChannelFlagsBitField';
import { kData } from '../utils/symbols';
import { isIdSet } from '../utils/type-guards';
import type { Partialize } from '../utils/types';

/**
 * Represents a guild on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Intentionally does not export `roles`, `emojis`, `features`, or `stickers`,
 *  so extending classes can map each array to `Role[]`, `Emoji[]`, `GuildFeature[]`, and `Sticker[]` respectively.
 * @remarks has substructures GuildWelcomeScreen and GuildIncidentsData, which needs to be instantiated and stored by any extending classes using it.
 */
export class Guild<Omitted extends keyof APIGuild | '' = ''> extends Structure<APIGuild, Omitted> {
	/**
	 * @param data - The raw data from the API for the guild.
	 */
	public constructor(data: Partialize<APIGuild, Omitted>) {
		super(data);
	}

	/**
	 * The id of the guild.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the guild
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
	 * The icon hash of the guild, when returned in the template object
	 *
	 * @see https://discord.com/developers/docs/reference#image-formatting
	 */
	public get iconHash() {
		return this[kData].icon_hash;
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
	 *  Returns `true` if the user is the owner of the guild.
	 *  #### This field is only received from https://discord.com/developers/docs/resources/user#get-current-user-guilds
	 */
	public get owner() {
		return this[kData].owner;
	}

	/**
	 * The id of the owner of the guild.
	 */
	public get ownerId() {
		return this[kData].owner_id;
	}

	/**
	 * Total permissions for the user in the guild (excluding overwrites)
	 * #### This field is only received from https://discord.com/developers/docs/resources/user#get-current-user-guilds
	 *
	 * @see https://en.wikipedia.org/wiki/Bit_field
	 */
	public get permissions() {
		return this[kData].permissions;
	}

	/**
	 * The id of the afk channel.
	 */
	public get afkChannelId() {
		return this[kData].afk_channel_id;
	}

	/**
	 * The afk timeout (in seconds).
	 * Can be set to: `60`, `300`, `900`, `1800`, `3600`
	 */
	public get afkTimeout() {
		return this[kData].afk_timeout;
	}

	/**
	 *  Returns `true` if the guild's widget is enabled.
	 */
	public get widgetEnabled() {
		return this[kData].widget_enabled;
	}

	/**
	 * The channel id that the widget will generate an invite to, or `null` if set to no invite.
	 */
	public get widgetChannelId() {
		return this[kData].widget_channel_id;
	}

	/**
	 * The verification level required for the guild.
	 *
	 * @see https://discord.com/developers/docs/resources/guild#guild-object-verification-level
	 */
	public get verificationLevel() {
		return this[kData].verification_level;
	}

	/**
	 * The default message notifications level.
	 *
	 * @see https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level
	 */
	public get defaultMessageNotifications() {
		return this[kData].default_message_notifications;
	}

	/**
	 * The explicit content filter level.
	 *
	 * @see https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level
	 */
	public get explicitContentFilter() {
		return this[kData].explicit_content_filter;
	}

	/**
	 * The required MFA level for the guild.
	 *
	 * @see https://discord.com/developers/docs/resources/guild#guild-object-mfa-level
	 */
	public get mfaLevel() {
		return this[kData].mfa_level;
	}

	/**
	 * Application id of the guild creator, if it is bot-created.
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * The id of the channel where guild notices (such as welcome messages and boost events) are posted.
	 */
	public get systemChannelId() {
		return this[kData].system_channel_id;
	}

	/**
	 * The system channel flags
	 *
	 * @see https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
	 */
	public get systemChannelFlags() {
		const flags = this[kData].system_channel_flags;
		return flags
			? new GuildSystemChannelFlagsBitField(this[kData].system_channel_flags as GuildSystemChannelFlags)
			: null;
	}

	/**
	 * The id of the channel where community guilds can display rules and/or guidelines.
	 */
	public get rulesChannelId() {
		return this[kData].rules_channel_id;
	}

	/**
	 * The maximum number of presences for the guild. (`null` is always returned, apart for the largest of guilds.)
	 */
	public get maxPresences() {
		return this[kData].max_presences;
	}

	/**
	 * The maximum number of members for the guild.
	 */
	public get maxMembers() {
		return this[kData].max_members;
	}

	/**
	 * The vanity URL code for the guild.
	 */
	public get vanityURLCode() {
		return this[kData].vanity_url_code;
	}

	/**
	 * The description for the guild.
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The banner hash for the guild.
	 *
	 * @see https://discord.com/developers/docs/reference#image-formatting
	 */
	public get banner() {
		return this[kData].banner;
	}

	/**
	 * The premium tier (server boost level) for the guild.
	 *
	 * @see https://discord.com/developers/docs/resources/guild#guild-object-premium-tier
	 */
	public get premiumTier() {
		return this[kData].premium_tier;
	}

	/**
	 * The number of boosts this guild currently has.
	 */
	public get premiumSubscriptionCount() {
		return this[kData].premium_subscription_count;
	}

	/**
	 * The preferred locale of a community guild. Used in server discover and notices in discord.
	 *
	 * @defaultValue "en-US"
	 */
	public get preferredLocale() {
		return this[kData].preferred_locale;
	}

	/**
	 * The id of the channel where admins and moderators of Community guilds receive notices from Discord.
	 */
	public get publicUpdatesChannelId() {
		return this[kData].public_updates_channel_id;
	}

	/**
	 * The maximum amount of users in a video channel.
	 */
	public get maxVideoChannelUsers() {
		return this[kData].max_video_channel_users;
	}

	/**
	 * The maximum amount of users in a stage video channel.
	 */
	public get maxStageVideoChannelUsers() {
		return this[kData].max_stage_video_channel_users;
	}

	/**
	 * Approximate number of members in this guild, returned from the `GET /guilds/<id>` and `/users/@me/guilds` endpoints when `with_counts` is `true`
	 */
	public get approximateMemberCount() {
		return this[kData].approximate_member_count;
	}

	/**
	 * Approximate number of non-offline members in this guild, returned from the `GET /guilds/<id>` and `/users/@me/guilds` endpoints when `with_counts` is `true`
	 */
	public get approximatePresenceCount() {
		return this[kData].approximate_presence_count;
	}

	/**
	 * The guild's NSFW level.
	 *
	 * @see https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level
	 */
	public get nsfwLevel() {
		return this[kData].nsfw_level;
	}

	/**
	 * Whether the guild has the boost progress bar enabled.
	 */
	public get premiumProgressBarEnabled() {
		return this[kData].premium_progress_bar_enabled;
	}

	/**
	 * The id of the channel where admins and moderators of Community guilds receive safety alerts from discord.
	 */
	public get safetyAlertsChannelId() {
		return this[kData].safety_alerts_channel_id;
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
