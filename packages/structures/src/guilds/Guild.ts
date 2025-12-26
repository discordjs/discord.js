import type { APIGuild } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a guild (server) on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `WelcomeScreen`, `Role`, `GuildEmoji`, `Sticker`, which need to be instantiated and stored by an extending class using it
 */
export abstract class Guild<Omitted extends keyof APIGuild | '' = ''> extends Structure<APIGuild, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Guild
	 */
	public static override readonly DataTemplate: Partial<APIGuild> = {};

	/**
	 * @param data - The raw data received from the API for the guild
	 */
	public constructor(data: Partialize<APIGuild, Omitted>) {
		super(data);
	}

	/**
	 * The guild id
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The guild name
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The guild icon hash
	 */
	public get icon() {
		return this[kData].icon;
	}

	/**
	 * The guild splash hash
	 */
	public get splash() {
		return this[kData].splash;
	}

	/**
	 * The guild discovery splash hash
	 */
	public get discoverySplash() {
		return this[kData].discovery_splash;
	}

	/**
	 * The id of the owner
	 */
	public get ownerId() {
		return this[kData].owner_id;
	}

	/**
	 * The id of the afk channel
	 */
	public get afkChannelId() {
		return this[kData].afk_channel_id;
	}

	/**
	 * Afk timeout in seconds
	 */
	public get afkTimeout() {
		return this[kData].afk_timeout;
	}

	/**
	 * Whether the guild widget is enabled
	 */
	public get widgetEnabled() {
		return this[kData].widget_enabled;
	}

	/**
	 * The channel id that the widget will generate an invite to
	 */
	public get widgetChannelId() {
		return this[kData].widget_channel_id;
	}

	/**
	 * Verification level required for the guild
	 */
	public get verificationLevel() {
		return this[kData].verification_level;
	}

	/**
	 * Default message notifications level
	 */
	public get defaultMessageNotifications() {
		return this[kData].default_message_notifications;
	}

	/**
	 * Explicit content filter level
	 */
	public get explicitContentFilter() {
		return this[kData].explicit_content_filter;
	}

	/**
	 * Enabled guild features
	 */
	public get features() {
		return this[kData].features;
	}

	/**
	 * Required MFA level for the guild
	 */
	public get mfaLevel() {
		return this[kData].mfa_level;
	}

	/**
	 * Application id of the guild creator if it is bot-created
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * The id of the channel where guild notices such as welcome messages and boost events are posted
	 */
	public get systemChannelId() {
		return this[kData].system_channel_id;
	}

	/**
	 * System channel flags
	 */
	public get systemChannelFlags() {
		return this[kData].system_channel_flags;
	}

	/**
	 * The id of the channel where Community guilds can display rules and/or guidelines
	 */
	public get rulesChannelId() {
		return this[kData].rules_channel_id;
	}

	/**
	 * The maximum number of presences for the guild
	 */
	public get maxPresences() {
		return this[kData].max_presences;
	}

	/**
	 * The maximum number of members for the guild
	 */
	public get maxMembers() {
		return this[kData].max_members;
	}

	/**
	 * The vanity url code for the guild
	 */
	public get vanityUrlCode() {
		return this[kData].vanity_url_code;
	}

	/**
	 * The description of the guild
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The guild banner hash
	 */
	public get banner() {
		return this[kData].banner;
	}

	/**
	 * Premium tier (Server Boost level)
	 */
	public get premiumTier() {
		return this[kData].premium_tier;
	}

	/**
	 * The number of boosts this guild currently has
	 */
	public get premiumSubscriptionCount() {
		return this[kData].premium_subscription_count;
	}

	/**
	 * The preferred locale of a Community guild
	 */
	public get preferredLocale() {
		return this[kData].preferred_locale;
	}

	/**
	 * The id of the channel where admins and moderators of Community guilds receive notices from Discord
	 */
	public get publicUpdatesChannelId() {
		return this[kData].public_updates_channel_id;
	}

	/**
	 * The maximum amount of users in a video channel
	 */
	public get maxVideoChannelUsers() {
		return this[kData].max_video_channel_users;
	}

	/**
	 * The maximum amount of users in a stage video channel
	 */
	public get maxStageVideoChannelUsers() {
		return this[kData].max_stage_video_channel_users;
	}

	/**
	 * Approximate number of members in this guild
	 */
	public get approximateMemberCount() {
		return this[kData].approximate_member_count;
	}

	/**
	 * Approximate number of non-offline members in this guild
	 */
	public get approximatePresenceCount() {
		return this[kData].approximate_presence_count;
	}

	/**
	 * The NSFW level of the guild
	 */
	public get nsfwLevel() {
		return this[kData].nsfw_level;
	}

	/**
	 * Whether the guild has the boost progress bar enabled
	 */
	public get premiumProgressBarEnabled() {
		return this[kData].premium_progress_bar_enabled;
	}

	/**
	 * The id of the channel where admins and moderators of Community guilds receive safety alerts from Discord
	 */
	public get safetyAlertsChannelId() {
		return this[kData].safety_alerts_channel_id;
	}
}
