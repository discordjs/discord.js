'use strict';

const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { ChannelType, GuildPremiumTier, Routes, GuildFeature } = require('discord-api-types/v10');
const AnonymousGuild = require('./AnonymousGuild');
const GuildAuditLogs = require('./GuildAuditLogs');
const { GuildOnboarding } = require('./GuildOnboarding');
const GuildPreview = require('./GuildPreview');
const GuildTemplate = require('./GuildTemplate');
const Integration = require('./Integration');
const Webhook = require('./Webhook');
const WelcomeScreen = require('./WelcomeScreen');
const { DiscordjsError, DiscordjsTypeError, ErrorCodes } = require('../errors');
const AutoModerationRuleManager = require('../managers/AutoModerationRuleManager');
const GuildApplicationCommandManager = require('../managers/GuildApplicationCommandManager');
const GuildBanManager = require('../managers/GuildBanManager');
const GuildChannelManager = require('../managers/GuildChannelManager');
const GuildEmojiManager = require('../managers/GuildEmojiManager');
const GuildInviteManager = require('../managers/GuildInviteManager');
const GuildMemberManager = require('../managers/GuildMemberManager');
const GuildScheduledEventManager = require('../managers/GuildScheduledEventManager');
const { GuildSoundboardSoundManager } = require('../managers/GuildSoundboardSoundManager');
const GuildStickerManager = require('../managers/GuildStickerManager');
const PresenceManager = require('../managers/PresenceManager');
const RoleManager = require('../managers/RoleManager');
const StageInstanceManager = require('../managers/StageInstanceManager');
const VoiceStateManager = require('../managers/VoiceStateManager');
const { resolveImage } = require('../util/DataResolver');
const Status = require('../util/Status');
const SystemChannelFlagsBitField = require('../util/SystemChannelFlagsBitField');
const { _transformAPIIncidentsData } = require('../util/Transformers.js');
const { discordSort, getSortableGroupTypes, resolvePartialEmoji } = require('../util/Util');

/**
 * Represents a guild (or a server) on Discord.
 * <info>It's recommended to see if a guild is available before performing operations or reading data from it. You can
 * check this with {@link Guild#available}.</info>
 * @extends {AnonymousGuild}
 */
class Guild extends AnonymousGuild {
  constructor(client, data) {
    super(client, data, false);

    /**
     * A manager of the application commands belonging to this guild
     * @type {GuildApplicationCommandManager}
     */
    this.commands = new GuildApplicationCommandManager(this);

    /**
     * A manager of the members belonging to this guild
     * @type {GuildMemberManager}
     */
    this.members = new GuildMemberManager(this);

    /**
     * A manager of the channels belonging to this guild
     * @type {GuildChannelManager}
     */
    this.channels = new GuildChannelManager(this);

    /**
     * A manager of the bans belonging to this guild
     * @type {GuildBanManager}
     */
    this.bans = new GuildBanManager(this);

    /**
     * A manager of the roles belonging to this guild
     * @type {RoleManager}
     */
    this.roles = new RoleManager(this);

    /**
     * A manager of the presences belonging to this guild
     * @type {PresenceManager}
     */
    this.presences = new PresenceManager(this.client);

    /**
     * A manager of the voice states of this guild
     * @type {VoiceStateManager}
     */
    this.voiceStates = new VoiceStateManager(this);

    /**
     * A manager of the stage instances of this guild
     * @type {StageInstanceManager}
     */
    this.stageInstances = new StageInstanceManager(this);

    /**
     * A manager of the invites of this guild
     * @type {GuildInviteManager}
     */
    this.invites = new GuildInviteManager(this);

    /**
     * A manager of the scheduled events of this guild
     * @type {GuildScheduledEventManager}
     */
    this.scheduledEvents = new GuildScheduledEventManager(this);

    /**
     * A manager of the auto moderation rules of this guild.
     * @type {AutoModerationRuleManager}
     */
    this.autoModerationRules = new AutoModerationRuleManager(this);

    /**
     * A manager of the soundboard sounds of this guild.
     * @type {GuildSoundboardSoundManager}
     */
    this.soundboardSounds = new GuildSoundboardSoundManager(this);

    if (!data) return;
    if (data.unavailable) {
      /**
       * Whether the guild is available to access. If it is not available, it indicates a server outage
       * @type {boolean}
       */
      this.available = false;
    } else {
      this._patch(data);
      if (!data.channels) this.available = false;
    }

    /**
     * The id of the shard this Guild belongs to.
     * @type {number}
     */
    this.shardId = data.shardId;
  }

  /**
   * The Shard this Guild belongs to.
   * @type {WebSocketShard}
   * @readonly
   */
  get shard() {
    return this.client.ws.shards.get(this.shardId);
  }

  _patch(data) {
    super._patch(data);
    this.id = data.id;
    if ('name' in data) this.name = data.name;
    if ('icon' in data) this.icon = data.icon;
    if ('unavailable' in data) {
      this.available = !data.unavailable;
    } else {
      this.available ??= true;
    }

    if ('discovery_splash' in data) {
      /**
       * The hash of the guild discovery splash image
       * @type {?string}
       */
      this.discoverySplash = data.discovery_splash;
    }

    if ('member_count' in data) {
      /**
       * The full amount of members in this guild
       * @type {number}
       */
      this.memberCount = data.member_count;
    }

    if ('large' in data) {
      /**
       * Whether the guild is "large" (has more than {@link WebSocketOptions large_threshold} members, 50 by default)
       * @type {boolean}
       */
      this.large = Boolean(data.large);
    }

    if ('premium_progress_bar_enabled' in data) {
      /**
       * Whether this guild has its premium (boost) progress bar enabled
       * @type {boolean}
       */
      this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
    }

    if ('application_id' in data) {
      /**
       * The id of the application that created this guild (if applicable)
       * @type {?Snowflake}
       */
      this.applicationId = data.application_id;
    }

    if ('afk_timeout' in data) {
      /**
       * The time in seconds before a user is counted as "away from keyboard"
       * @type {?number}
       */
      this.afkTimeout = data.afk_timeout;
    }

    if ('afk_channel_id' in data) {
      /**
       * The id of the voice channel where AFK members are moved
       * @type {?Snowflake}
       */
      this.afkChannelId = data.afk_channel_id;
    }

    if ('system_channel_id' in data) {
      /**
       * The system channel's id
       * @type {?Snowflake}
       */
      this.systemChannelId = data.system_channel_id;
    }

    if ('premium_tier' in data) {
      /**
       * The premium tier of this guild
       * @type {GuildPremiumTier}
       */
      this.premiumTier = data.premium_tier;
    }

    if ('widget_enabled' in data) {
      /**
       * Whether widget images are enabled on this guild
       * @type {?boolean}
       */
      this.widgetEnabled = data.widget_enabled;
    } else {
      this.widgetEnabled ??= null;
    }

    if ('widget_channel_id' in data) {
      /**
       * The widget channel's id, if enabled
       * @type {?string}
       */
      this.widgetChannelId = data.widget_channel_id;
    } else {
      this.widgetChannelId ??= null;
    }

    if ('explicit_content_filter' in data) {
      /**
       * The explicit content filter level of the guild
       * @type {GuildExplicitContentFilter}
       */
      this.explicitContentFilter = data.explicit_content_filter;
    }

    if ('mfa_level' in data) {
      /**
       * The required MFA level for this guild
       * @type {GuildMFALevel}
       */
      this.mfaLevel = data.mfa_level;
    }

    if ('joined_at' in data) {
      /**
       * The timestamp the client user joined the guild at
       * @type {number}
       */
      this.joinedTimestamp = Date.parse(data.joined_at);
    }

    if ('default_message_notifications' in data) {
      /**
       * The default message notification level of the guild
       * @type {GuildDefaultMessageNotifications}
       */
      this.defaultMessageNotifications = data.default_message_notifications;
    }

    if ('system_channel_flags' in data) {
      /**
       * The value set for the guild's system channel flags
       * @type {Readonly<SystemChannelFlagsBitField>}
       */
      this.systemChannelFlags = new SystemChannelFlagsBitField(data.system_channel_flags).freeze();
    }

    if ('max_members' in data) {
      /**
       * The maximum amount of members the guild can have
       * @type {?number}
       */
      this.maximumMembers = data.max_members;
    } else {
      this.maximumMembers ??= null;
    }

    if ('max_presences' in data) {
      /**
       * The maximum amount of presences the guild can have (this is `null` for all but the largest of guilds)
       * <info>You will need to fetch the guild using {@link BaseGuild#fetch} if you want to receive
       * this parameter</info>
       * @type {?number}
       */
      this.maximumPresences = data.max_presences;
    } else {
      this.maximumPresences ??= null;
    }

    if ('max_video_channel_users' in data) {
      /**
       * The maximum amount of users allowed in a video channel.
       * @type {?number}
       */
      this.maxVideoChannelUsers = data.max_video_channel_users;
    } else {
      this.maxVideoChannelUsers ??= null;
    }

    if ('max_stage_video_channel_users' in data) {
      /**
       * The maximum amount of users allowed in a stage video channel.
       * @type {?number}
       */
      this.maxStageVideoChannelUsers = data.max_stage_video_channel_users;
    } else {
      this.maxStageVideoChannelUsers ??= null;
    }

    if ('approximate_member_count' in data) {
      /**
       * The approximate amount of members the guild has
       * <info>You will need to fetch the guild using {@link BaseGuild#fetch} if you want to receive
       * this parameter</info>
       * @type {?number}
       */
      this.approximateMemberCount = data.approximate_member_count;
    } else {
      this.approximateMemberCount ??= null;
    }

    if ('approximate_presence_count' in data) {
      /**
       * The approximate amount of presences the guild has
       * <info>You will need to fetch the guild using {@link BaseGuild#fetch} if you want to receive
       * this parameter</info>
       * @type {?number}
       */
      this.approximatePresenceCount = data.approximate_presence_count;
    } else {
      this.approximatePresenceCount ??= null;
    }

    /**
     * The use count of the vanity URL code of the guild, if any
     * <info>You will need to fetch this parameter using {@link Guild#fetchVanityData} if you want to receive it</info>
     * @type {?number}
     */
    this.vanityURLUses ??= null;

    if ('rules_channel_id' in data) {
      /**
       * The rules channel's id for the guild
       * @type {?Snowflake}
       */
      this.rulesChannelId = data.rules_channel_id;
    }

    if ('public_updates_channel_id' in data) {
      /**
       * The community updates channel's id for the guild
       * @type {?Snowflake}
       */
      this.publicUpdatesChannelId = data.public_updates_channel_id;
    }

    if ('preferred_locale' in data) {
      /**
       * The preferred locale of the guild, defaults to `en-US`
       * @type {Locale}
       */
      this.preferredLocale = data.preferred_locale;
    }

    if ('safety_alerts_channel_id' in data) {
      /**
       * The safety alerts channel's id for the guild
       * @type {?Snowflake}
       */
      this.safetyAlertsChannelId = data.safety_alerts_channel_id;
    } else {
      this.safetyAlertsChannelId ??= null;
    }

    if (data.channels) {
      this.channels.cache.clear();
      for (const rawChannel of data.channels) {
        this.client.channels._add(rawChannel, this);
      }
    }

    if (data.threads) {
      for (const rawThread of data.threads) {
        this.client.channels._add(rawThread, this);
      }
    }

    if (data.roles) {
      this.roles.cache.clear();
      for (const role of data.roles) this.roles._add(role);
    }

    if (data.members) {
      this.members.cache.clear();
      for (const guildUser of data.members) this.members._add(guildUser);
    }

    if ('owner_id' in data) {
      /**
       * The user id of this guild's owner
       * @type {Snowflake}
       */
      this.ownerId = data.owner_id;
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this.presences._add(Object.assign(presence, { guild: this }));
      }
    }

    if (data.stage_instances) {
      this.stageInstances.cache.clear();
      for (const stageInstance of data.stage_instances) {
        this.stageInstances._add(stageInstance);
      }
    }

    if (data.guild_scheduled_events) {
      this.scheduledEvents.cache.clear();
      for (const scheduledEvent of data.guild_scheduled_events) {
        this.scheduledEvents._add(scheduledEvent);
      }
    }

    if (data.voice_states) {
      this.voiceStates.cache.clear();
      for (const voiceState of data.voice_states) {
        this.voiceStates._add(voiceState);
      }
    }

    if (!this.emojis) {
      /**
       * A manager of the emojis belonging to this guild
       * @type {GuildEmojiManager}
       */
      this.emojis = new GuildEmojiManager(this);
      if (data.emojis) for (const emoji of data.emojis) this.emojis._add(emoji);
    } else if (data.emojis) {
      this.client.actions.GuildEmojisUpdate.handle({
        guild_id: this.id,
        emojis: data.emojis,
      });
    }

    if (!this.stickers) {
      /**
       * A manager of the stickers belonging to this guild
       * @type {GuildStickerManager}
       */
      this.stickers = new GuildStickerManager(this);
      if (data.stickers) for (const sticker of data.stickers) this.stickers._add(sticker);
    } else if (data.stickers) {
      this.client.actions.GuildStickersUpdate.handle({
        guild_id: this.id,
        stickers: data.stickers,
      });
    }

    if ('incidents_data' in data) {
      /**
       * Incident actions of a guild.
       * @typedef {Object} IncidentActions
       * @property {?Date} invitesDisabledUntil When invites would be enabled again
       * @property {?Date} dmsDisabledUntil When direct messages would be enabled again
       * @property {?Date} dmSpamDetectedAt When direct message spam was detected
       * @property {?Date} raidDetectedAt When a raid was detected
       */

      /**
       * The incidents data of this guild.
       * <info>You will need to fetch the guild using {@link BaseGuild#fetch} if you want to receive
       * this property.</info>
       * @type {?IncidentActions}
       */
      this.incidentsData = data.incidents_data && _transformAPIIncidentsData(data.incidents_data);
    } else {
      this.incidentsData ??= null;
    }

    if (data.soundboard_sounds) {
      this.soundboardSounds.cache.clear();
      for (const soundboardSound of data.soundboard_sounds) {
        this.soundboardSounds._add(soundboardSound);
      }
    }
  }

  /**
   * The time the client user joined the guild
   * @type {Date}
   * @readonly
   */
  get joinedAt() {
    return new Date(this.joinedTimestamp);
  }

  /**
   * The URL to this guild's discovery splash image.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  discoverySplashURL(options = {}) {
    return this.discoverySplash && this.client.rest.cdn.discoverySplash(this.id, this.discoverySplash, options);
  }

  /**
   * Fetches the owner of the guild.
   * If the member object isn't needed, use {@link Guild#ownerId} instead.
   * @param {BaseFetchOptions} [options] The options for fetching the member
   * @returns {Promise<GuildMember>}
   */
  async fetchOwner(options) {
    if (!this.ownerId) {
      throw new DiscordjsError(ErrorCodes.FetchOwnerId, 'guild');
    }
    const member = await this.members.fetch({ ...options, user: this.ownerId });
    return member;
  }

  /**
   * AFK voice channel for this guild
   * @type {?VoiceChannel}
   * @readonly
   */
  get afkChannel() {
    return this.client.channels.resolve(this.afkChannelId);
  }

  /**
   * System channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get systemChannel() {
    return this.client.channels.resolve(this.systemChannelId);
  }

  /**
   * Widget channel for this guild
   * @type {?(TextChannel|NewsChannel|VoiceChannel|StageChannel|ForumChannel|MediaChannel)}
   * @readonly
   */
  get widgetChannel() {
    return this.client.channels.resolve(this.widgetChannelId);
  }

  /**
   * Rules channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get rulesChannel() {
    return this.client.channels.resolve(this.rulesChannelId);
  }

  /**
   * Public updates channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get publicUpdatesChannel() {
    return this.client.channels.resolve(this.publicUpdatesChannelId);
  }

  /**
   * Safety alerts channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get safetyAlertsChannel() {
    return this.client.channels.resolve(this.safetyAlertsChannelId);
  }

  /**
   * The maximum bitrate available for this guild
   * @type {number}
   * @readonly
   */
  get maximumBitrate() {
    if (this.features.includes(GuildFeature.VIPRegions)) {
      return 384_000;
    }

    switch (this.premiumTier) {
      case GuildPremiumTier.Tier1:
        return 128_000;
      case GuildPremiumTier.Tier2:
        return 256_000;
      case GuildPremiumTier.Tier3:
        return 384_000;
      default:
        return 96_000;
    }
  }

  /**
   * Fetches a collection of integrations to this guild.
   * Resolves with a collection mapping integrations by their ids.
   * @returns {Promise<Collection<Snowflake|string, Integration>>}
   * @example
   * // Fetch integrations
   * guild.fetchIntegrations()
   *   .then(integrations => console.log(`Fetched ${integrations.size} integrations`))
   *   .catch(console.error);
   */
  async fetchIntegrations() {
    const data = await this.client.rest.get(Routes.guildIntegrations(this.id));
    return data.reduce(
      (collection, integration) => collection.set(integration.id, new Integration(this.client, integration, this)),
      new Collection(),
    );
  }

  /**
   * Fetches a collection of templates from this guild.
   * Resolves with a collection mapping templates by their codes.
   * @returns {Promise<Collection<string, GuildTemplate>>}
   */
  async fetchTemplates() {
    const templates = await this.client.rest.get(Routes.guildTemplates(this.id));
    return templates.reduce((col, data) => col.set(data.code, new GuildTemplate(this.client, data)), new Collection());
  }

  /**
   * Fetches the welcome screen for this guild.
   * @returns {Promise<WelcomeScreen>}
   */
  async fetchWelcomeScreen() {
    const data = await this.client.rest.get(Routes.guildWelcomeScreen(this.id));
    return new WelcomeScreen(this, data);
  }

  /**
   * Creates a template for the guild.
   * @param {string} name The name for the template
   * @param {string} [description] The description for the template
   * @returns {Promise<GuildTemplate>}
   */
  async createTemplate(name, description) {
    const data = await this.client.rest.post(Routes.guildTemplates(this.id), { body: { name, description } });
    return new GuildTemplate(this.client, data);
  }

  /**
   * Obtains a guild preview for this guild from Discord.
   * @returns {Promise<GuildPreview>}
   */
  async fetchPreview() {
    const data = await this.client.rest.get(Routes.guildPreview(this.id));
    return new GuildPreview(this.client, data);
  }

  /**
   * An object containing information about a guild's vanity invite.
   * @typedef {Object} Vanity
   * @property {?string} code Vanity invite code
   * @property {number} uses How many times this invite has been used
   */

  /**
   * Fetches the vanity URL invite object to this guild.
   * Resolves with an object containing the vanity URL invite code and the use count
   * @returns {Promise<Vanity>}
   * @example
   * // Fetch invite data
   * guild.fetchVanityData()
   *   .then(res => {
   *     console.log(`Vanity URL: https://discord.gg/${res.code} with ${res.uses} uses`);
   *   })
   *   .catch(console.error);
   */
  async fetchVanityData() {
    const data = await this.client.rest.get(Routes.guildVanityUrl(this.id));
    this.vanityURLCode = data.code;
    this.vanityURLUses = data.uses;

    return data;
  }

  /**
   * Fetches all webhooks for the guild.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   * @example
   * // Fetch webhooks
   * guild.fetchWebhooks()
   *   .then(webhooks => console.log(`Fetched ${webhooks.size} webhooks`))
   *   .catch(console.error);
   */
  async fetchWebhooks() {
    const apiHooks = await this.client.rest.get(Routes.guildWebhooks(this.id));
    const hooks = new Collection();
    for (const hook of apiHooks) hooks.set(hook.id, new Webhook(this.client, hook));
    return hooks;
  }

  /**
   * Fetches the guild widget data, requires the widget to be enabled.
   * @returns {Promise<Widget>}
   * @example
   * // Fetches the guild widget data
   * guild.fetchWidget()
   *   .then(widget => console.log(`The widget shows ${widget.channels.size} channels`))
   *   .catch(console.error);
   */
  fetchWidget() {
    return this.client.fetchGuildWidget(this.id);
  }

  /**
   * Data for the Guild Widget Settings object
   * @typedef {Object} GuildWidgetSettings
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?(TextChannel|NewsChannel|VoiceChannel|StageChannel|ForumChannel|MediaChannel)} channel
   * The widget invite channel
   */

  /**
   * The Guild Widget Settings object
   * @typedef {Object} GuildWidgetSettingsData
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?(TextChannel|NewsChannel|VoiceChannel|StageChannel|ForumChannel|MediaChannel|Snowflake)} channel
   * The widget invite channel
   */

  /**
   * Fetches the guild widget settings.
   * @returns {Promise<GuildWidgetSettings>}
   * @example
   * // Fetches the guild widget settings
   * guild.fetchWidgetSettings()
   *   .then(widget => console.log(`The widget is ${widget.enabled ? 'enabled' : 'disabled'}`))
   *   .catch(console.error);
   */
  async fetchWidgetSettings() {
    const data = await this.client.rest.get(Routes.guildWidgetSettings(this.id));
    this.widgetEnabled = data.enabled;
    this.widgetChannelId = data.channel_id;
    return {
      enabled: data.enabled,
      channel: data.channel_id ? this.channels.cache.get(data.channel_id) : null,
    };
  }

  /**
   * Returns a URL for the PNG widget of the guild.
   * @param {GuildWidgetStyle} [style] The style for the widget image
   * @returns {string}
   */
  widgetImageURL(style) {
    return this.client.guilds.widgetImageURL(this.id, style);
  }

  /**
   * Options used to fetch audit logs.
   * @typedef {Object} GuildAuditLogsFetchOptions
   * @property {Snowflake|GuildAuditLogsEntry} [before] Consider only entries before this entry
   * @property {Snowflake|GuildAuditLogsEntry} [after] Consider only entries after this entry
   * @property {number} [limit] The number of entries to return
   * @property {UserResolvable} [user] Only return entries for actions made by this user
   * @property {?AuditLogEvent} [type] Only return entries for this action type
   */

  /**
   * Fetches audit logs for this guild.
   * @param {GuildAuditLogsFetchOptions} [options={}] Options for fetching audit logs
   * @returns {Promise<GuildAuditLogs>}
   * @example
   * // Output audit log entries
   * guild.fetchAuditLogs()
   *   .then(audit => console.log(audit.entries.first()))
   *   .catch(console.error);
   */
  async fetchAuditLogs({ before, after, limit, user, type } = {}) {
    const query = makeURLSearchParams({
      before: before?.id ?? before,
      after: after?.id ?? after,
      limit,
      action_type: type,
    });

    if (user) {
      const userId = this.client.users.resolveId(user);
      if (!userId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'user', 'UserResolvable');
      query.set('user_id', userId);
    }

    const data = await this.client.rest.get(Routes.guildAuditLog(this.id), { query });
    return new GuildAuditLogs(this, data);
  }

  /**
   * Fetches the guild onboarding data for this guild.
   * @returns {Promise<GuildOnboarding>}
   */
  async fetchOnboarding() {
    const data = await this.client.rest.get(Routes.guildOnboarding(this.id));
    return new GuildOnboarding(this.client, data);
  }

  /**
   * The data for editing a guild.
   * @typedef {Object} GuildEditOptions
   * @property {string} [name] The name of the guild
   * @property {?GuildVerificationLevel} [verificationLevel] The verification level of the guild
   * @property {?GuildDefaultMessageNotifications} [defaultMessageNotifications] The default message
   * notification level of the guild
   * @property {?GuildExplicitContentFilter} [explicitContentFilter] The level of the explicit content filter
   * @property {?VoiceChannelResolvable} [afkChannel] The AFK channel of the guild
   * @property {number} [afkTimeout] The AFK timeout of the guild
   * @property {?(BufferResolvable|Base64Resolvable)} [icon] The icon of the guild
   * @property {GuildMemberResolvable} [owner] The owner of the guild
   * @property {?(BufferResolvable|Base64Resolvable)} [splash] The invite splash image of the guild
   * @property {?(BufferResolvable|Base64Resolvable)} [discoverySplash] The discovery splash image of the guild
   * @property {?(BufferResolvable|Base64Resolvable)} [banner] The banner of the guild
   * @property {?TextChannelResolvable} [systemChannel] The system channel of the guild
   * @property {SystemChannelFlagsResolvable} [systemChannelFlags] The system channel flags of the guild
   * @property {?TextChannelResolvable} [rulesChannel] The rules channel of the guild
   * @property {?TextChannelResolvable} [publicUpdatesChannel] The community updates channel of the guild
   * @property {?TextChannelResolvable} [safetyAlertsChannel] The safety alerts channel of the guild
   * @property {?string} [preferredLocale] The preferred locale of the guild
   * @property {GuildFeature[]} [features] The features of the guild
   * @property {?string} [description] The discovery description of the guild
   * @property {boolean} [premiumProgressBarEnabled] Whether the guild's premium progress bar is enabled
   * @property {string} [reason] Reason for editing this guild
   */

  /**
   * Data that can be resolved to a Text Channel object. This can be:
   * * A TextChannel
   * * A Snowflake
   * @typedef {TextChannel|Snowflake} TextChannelResolvable
   */

  /**
   * Data that can be resolved to a Voice Channel object. This can be:
   * * A VoiceChannel
   * * A Snowflake
   * @typedef {VoiceChannel|Snowflake} VoiceChannelResolvable
   */

  /**
   * Updates the guild with new information - e.g. a new name.
   * @param {GuildEditOptions} options The options to provide
   * @returns {Promise<Guild>}
   * @example
   * // Set the guild name
   * guild.edit({
   *   name: 'Discord Guild',
   * })
   *   .then(updated => console.log(`New guild name ${updated}`))
   *   .catch(console.error);
   */
  async edit({
    verificationLevel,
    defaultMessageNotifications,
    explicitContentFilter,
    afkChannel,
    afkTimeout,
    icon,
    owner,
    splash,
    discoverySplash,
    banner,
    systemChannel,
    systemChannelFlags,
    rulesChannel,
    publicUpdatesChannel,
    preferredLocale,
    premiumProgressBarEnabled,
    safetyAlertsChannel,
    ...options
  }) {
    const data = await this.client.rest.patch(Routes.guild(this.id), {
      body: {
        ...options,
        verification_level: verificationLevel,
        default_message_notifications: defaultMessageNotifications,
        explicit_content_filter: explicitContentFilter,
        afk_channel_id: afkChannel && this.client.channels.resolveId(afkChannel),
        afk_timeout: afkTimeout,
        icon: icon && (await resolveImage(icon)),
        owner_id: owner && this.client.users.resolveId(owner),
        splash: splash && (await resolveImage(splash)),
        discovery_splash: discoverySplash && (await resolveImage(discoverySplash)),
        banner: banner && (await resolveImage(banner)),
        system_channel_id: systemChannel && this.client.channels.resolveId(systemChannel),
        system_channel_flags:
          systemChannelFlags === undefined ? undefined : SystemChannelFlagsBitField.resolve(systemChannelFlags),
        rules_channel_id: rulesChannel && this.client.channels.resolveId(rulesChannel),
        public_updates_channel_id: publicUpdatesChannel && this.client.channels.resolveId(publicUpdatesChannel),
        preferred_locale: preferredLocale,
        premium_progress_bar_enabled: premiumProgressBarEnabled,
        safety_alerts_channel_id: safetyAlertsChannel && this.client.channels.resolveId(safetyAlertsChannel),
      },
      reason: options.reason,
    });

    return this.client.actions.GuildUpdate.handle(data).updated;
  }

  /**
   * Options used to edit the guild onboarding.
   * @typedef {Object} GuildOnboardingEditOptions
   * @property {GuildOnboardingPromptData[]|Collection<Snowflake, GuildOnboardingPrompt>} [prompts]
   * The prompts shown during onboarding and in customize community
   * @property {ChannelResolvable[]|Collection<Snowflake, GuildChannel>} [defaultChannels]
   * The channels that new members get opted into automatically
   * @property {boolean} [enabled] Whether the onboarding is enabled
   * @property {GuildOnboardingMode} [mode] The mode to edit the guild onboarding with
   * @property {string} [reason] The reason for editing the guild onboarding
   */

  /**
   * Data for editing a guild onboarding prompt.
   * @typedef {Object} GuildOnboardingPromptData
   * @property {Snowflake} [id] The id of the prompt
   * @property {string} title The title for the prompt
   * @property {boolean} [singleSelect] Whether users are limited to selecting one option for the prompt
   * @property {boolean} [required] Whether the prompt is required before a user completes the onboarding flow
   * @property {boolean} [inOnboarding] Whether the prompt is present in the onboarding flow
   * @property {GuildOnboardingPromptType} [type] The type of the prompt
   * @property {GuildOnboardingPromptOptionData[]|Collection<Snowflake, GuildOnboardingPrompt>} options
   * The options available within the prompt
   */

  /**
   * Data for editing a guild onboarding prompt option.
   * @typedef {Object} GuildOnboardingPromptOptionData
   * @property {?Snowflake} [id] The id of the option
   * @property {ChannelResolvable[]|Collection<Snowflake, GuildChannel>} [channels]
   * The channels a member is added to when the option is selected
   * @property {RoleResolvable[]|Collection<Snowflake, Role>} [roles]
   * The roles assigned to a member when the option is selected
   * @property {string} title The title of the option
   * @property {?string} [description] The description of the option
   * @property {?(EmojiIdentifierResolvable|Emoji)} [emoji] The emoji of the option
   */

  /**
   * Edits the guild onboarding data for this guild.
   * @param {GuildOnboardingEditOptions} options The options to provide
   * @returns {Promise<GuildOnboarding>}
   */
  async editOnboarding(options) {
    const newData = await this.client.rest.put(Routes.guildOnboarding(this.id), {
      body: {
        prompts: options.prompts?.map(prompt => ({
          // Currently, the prompt ids are required even for new ones (which won't be used)
          id: prompt.id ?? DiscordSnowflake.generate().toString(),
          title: prompt.title,
          single_select: prompt.singleSelect,
          required: prompt.required,
          in_onboarding: prompt.inOnboarding,
          type: prompt.type,
          options: prompt.options.map(option => {
            const emoji = resolvePartialEmoji(option.emoji);

            return {
              id: option.id,
              channel_ids: option.channels?.map(channel => this.channels.resolveId(channel)),
              role_ids: option.roles?.map(role => this.roles.resolveId(role)),
              title: option.title,
              description: option.description,
              emoji_animated: emoji?.animated,
              emoji_id: emoji?.id,
              emoji_name: emoji?.name,
            };
          }),
        })),
        default_channel_ids: options.defaultChannels?.map(channel => this.channels.resolveId(channel)),
        enabled: options.enabled,
        mode: options.mode,
      },
      reason: options.reason,
    });

    return new GuildOnboarding(this.client, newData);
  }

  /**
   * Welcome channel data
   * @typedef {Object} WelcomeChannelData
   * @property {string} description The description to show for this welcome channel
   * @property {TextChannel|NewsChannel|ForumChannel|MediaChannel|Snowflake} channel
   * The channel to link for this welcome channel
   * @property {EmojiIdentifierResolvable} [emoji] The emoji to display for this welcome channel
   */

  /**
   * Welcome screen edit data
   * @typedef {Object} WelcomeScreenEditOptions
   * @property {boolean} [enabled] Whether the welcome screen is enabled
   * @property {string} [description] The description for the welcome screen
   * @property {WelcomeChannelData[]} [welcomeChannels] The welcome channel data for the welcome screen
   */

  /**
   * Data that can be resolved to a GuildTextChannel object. This can be:
   * * A TextChannel
   * * A NewsChannel
   * * A Snowflake
   * @typedef {TextChannel|NewsChannel|Snowflake} GuildTextChannelResolvable
   */

  /**
   * Data that can be resolved to a GuildVoiceChannel object. This can be:
   * * A VoiceChannel
   * * A StageChannel
   * * A Snowflake
   * @typedef {VoiceChannel|StageChannel|Snowflake} GuildVoiceChannelResolvable
   */

  /**
   * Updates the guild's welcome screen
   * @param {WelcomeScreenEditOptions} options The options to provide
   * @returns {Promise<WelcomeScreen>}
   * @example
   * guild.editWelcomeScreen({
   *   description: 'Hello World',
   *   enabled: true,
   *   welcomeChannels: [
   *     {
   *       description: 'foobar',
   *       channel: '222197033908436994',
   *     }
   *   ],
   * })
   */
  async editWelcomeScreen(options) {
    const { enabled, description, welcomeChannels } = options;
    const welcome_channels = welcomeChannels?.map(welcomeChannelData => {
      const emoji = this.emojis.resolve(welcomeChannelData.emoji);
      return {
        emoji_id: emoji?.id,
        emoji_name: emoji?.name ?? welcomeChannelData.emoji,
        channel_id: this.channels.resolveId(welcomeChannelData.channel),
        description: welcomeChannelData.description,
      };
    });

    const patchData = await this.client.rest.patch(Routes.guildWelcomeScreen(this.id), {
      body: {
        welcome_channels,
        description,
        enabled,
      },
    });
    return new WelcomeScreen(this, patchData);
  }

  /**
   * Edits the level of the explicit content filter.
   * @param {?GuildExplicitContentFilter} explicitContentFilter The new level of the explicit content filter
   * @param {string} [reason] Reason for changing the level of the guild's explicit content filter
   * @returns {Promise<Guild>}
   */
  setExplicitContentFilter(explicitContentFilter, reason) {
    return this.edit({ explicitContentFilter, reason });
  }

  /**
   * Edits the setting of the default message notifications of the guild.
   * @param {?GuildDefaultMessageNotifications} defaultMessageNotifications
   * The new default message notification level of the guild
   * @param {string} [reason] Reason for changing the setting of the default message notifications
   * @returns {Promise<Guild>}
   */
  setDefaultMessageNotifications(defaultMessageNotifications, reason) {
    return this.edit({ defaultMessageNotifications, reason });
  }

  /**
   * Edits the flags of the default message notifications of the guild.
   * @param {SystemChannelFlagsResolvable} systemChannelFlags The new flags for the default message notifications
   * @param {string} [reason] Reason for changing the flags of the default message notifications
   * @returns {Promise<Guild>}
   */
  setSystemChannelFlags(systemChannelFlags, reason) {
    return this.edit({ systemChannelFlags, reason });
  }

  /**
   * Edits the name of the guild.
   * @param {string} name The new name of the guild
   * @param {string} [reason] Reason for changing the guild's name
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild name
   * guild.setName('Discord Guild')
   *  .then(updated => console.log(`Updated guild name to ${updated.name}`))
   *  .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name, reason });
  }

  /**
   * Edits the verification level of the guild.
   * @param {?GuildVerificationLevel} verificationLevel The new verification level of the guild
   * @param {string} [reason] Reason for changing the guild's verification level
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild verification level
   * guild.setVerificationLevel(1)
   *  .then(updated => console.log(`Updated guild verification level to ${guild.verificationLevel}`))
   *  .catch(console.error);
   */
  setVerificationLevel(verificationLevel, reason) {
    return this.edit({ verificationLevel, reason });
  }

  /**
   * Edits the AFK channel of the guild.
   * @param {?VoiceChannelResolvable} afkChannel The new AFK channel
   * @param {string} [reason] Reason for changing the guild's AFK channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated guild AFK channel to ${guild.afkChannel.name}`))
   *  .catch(console.error);
   */
  setAFKChannel(afkChannel, reason) {
    return this.edit({ afkChannel, reason });
  }

  /**
   * Edits the system channel of the guild.
   * @param {?TextChannelResolvable} systemChannel The new system channel
   * @param {string} [reason] Reason for changing the guild's system channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild system channel
   * guild.setSystemChannel(channel)
   *  .then(updated => console.log(`Updated guild system channel to ${guild.systemChannel.name}`))
   *  .catch(console.error);
   */
  setSystemChannel(systemChannel, reason) {
    return this.edit({ systemChannel, reason });
  }

  /**
   * Edits the AFK timeout of the guild.
   * @param {number} afkTimeout The time in seconds that a user must be idle to be considered AFK
   * @param {string} [reason] Reason for changing the guild's AFK timeout
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKTimeout(60)
   *  .then(updated => console.log(`Updated guild AFK timeout to ${guild.afkTimeout}`))
   *  .catch(console.error);
   */
  setAFKTimeout(afkTimeout, reason) {
    return this.edit({ afkTimeout, reason });
  }

  /**
   * Sets a new guild icon.
   * @param {?(Base64Resolvable|BufferResolvable)} icon The new icon of the guild
   * @param {string} [reason] Reason for changing the guild's icon
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild icon
   * guild.setIcon('./icon.png')
   *  .then(updated => console.log('Updated the guild icon'))
   *  .catch(console.error);
   */
  setIcon(icon, reason) {
    return this.edit({ icon, reason });
  }

  /**
   * Sets a new owner of the guild.
   * @param {GuildMemberResolvable} owner The new owner of the guild
   * @param {string} [reason] Reason for setting the new owner
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild owner
   * guild.setOwner(guild.members.cache.first())
   *  .then(guild => guild.fetchOwner())
   *  .then(owner => console.log(`Updated the guild owner to ${owner.displayName}`))
   *  .catch(console.error);
   */
  setOwner(owner, reason) {
    return this.edit({ owner, reason });
  }

  /**
   * Sets a new guild invite splash image.
   * @param {?(Base64Resolvable|BufferResolvable)} splash The new invite splash image of the guild
   * @param {string} [reason] Reason for changing the guild's invite splash image
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild splash
   * guild.setSplash('./splash.png')
   *  .then(updated => console.log('Updated the guild splash'))
   *  .catch(console.error);
   */
  setSplash(splash, reason) {
    return this.edit({ splash, reason });
  }

  /**
   * Sets a new guild discovery splash image.
   * @param {?(Base64Resolvable|BufferResolvable)} discoverySplash The new discovery splash image of the guild
   * @param {string} [reason] Reason for changing the guild's discovery splash image
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild discovery splash
   * guild.setDiscoverySplash('./discoverysplash.png')
   *   .then(updated => console.log('Updated the guild discovery splash'))
   *   .catch(console.error);
   */
  setDiscoverySplash(discoverySplash, reason) {
    return this.edit({ discoverySplash, reason });
  }

  /**
   * Sets a new guild banner.
   * @param {?(Base64Resolvable|BufferResolvable)} banner The new banner of the guild
   * @param {string} [reason] Reason for changing the guild's banner
   * @returns {Promise<Guild>}
   * @example
   * guild.setBanner('./banner.png')
   *  .then(updated => console.log('Updated the guild banner'))
   *  .catch(console.error);
   */
  setBanner(banner, reason) {
    return this.edit({ banner, reason });
  }

  /**
   * Edits the rules channel of the guild.
   * @param {?TextChannelResolvable} rulesChannel The new rules channel
   * @param {string} [reason] Reason for changing the guild's rules channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild rules channel
   * guild.setRulesChannel(channel)
   *  .then(updated => console.log(`Updated guild rules channel to ${guild.rulesChannel.name}`))
   *  .catch(console.error);
   */
  setRulesChannel(rulesChannel, reason) {
    return this.edit({ rulesChannel, reason });
  }

  /**
   * Edits the community updates channel of the guild.
   * @param {?TextChannelResolvable} publicUpdatesChannel The new community updates channel
   * @param {string} [reason] Reason for changing the guild's community updates channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild community updates channel
   * guild.setPublicUpdatesChannel(channel)
   *  .then(updated => console.log(`Updated guild community updates channel to ${guild.publicUpdatesChannel.name}`))
   *  .catch(console.error);
   */
  setPublicUpdatesChannel(publicUpdatesChannel, reason) {
    return this.edit({ publicUpdatesChannel, reason });
  }

  /**
   * Edits the preferred locale of the guild.
   * @param {?Locale} preferredLocale The new preferred locale of the guild
   * @param {string} [reason] Reason for changing the guild's preferred locale
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild preferred locale
   * guild.setPreferredLocale('en-US')
   *  .then(updated => console.log(`Updated guild preferred locale to ${guild.preferredLocale}`))
   *  .catch(console.error);
   */
  setPreferredLocale(preferredLocale, reason) {
    return this.edit({ preferredLocale, reason });
  }

  /**
   * Edits the enabled state of the guild's premium progress bar
   * @param {boolean} [enabled=true] The new enabled state of the guild's premium progress bar
   * @param {string} [reason] Reason for changing the state of the guild's premium progress bar
   * @returns {Promise<Guild>}
   */
  setPremiumProgressBarEnabled(enabled = true, reason) {
    return this.edit({ premiumProgressBarEnabled: enabled, reason });
  }

  /**
   * Edits the safety alerts channel of the guild.
   * @param {?TextChannelResolvable} safetyAlertsChannel The new safety alerts channel
   * @param {string} [reason] Reason for changing the guild's safety alerts channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild safety alerts channel
   * guild.setSafetyAlertsChannel(channel)
   *  .then(updated => console.log(`Updated guild safety alerts channel to ${updated.safetyAlertsChannel.name}`))
   *  .catch(console.error);
   */
  setSafetyAlertsChannel(safetyAlertsChannel, reason) {
    return this.edit({ safetyAlertsChannel, reason });
  }

  /**
   * Edits the guild's widget settings.
   * @param {GuildWidgetSettingsData} settings The widget settings for the guild
   * @param {string} [reason] Reason for changing the guild's widget settings
   * @returns {Promise<Guild>}
   */
  async setWidgetSettings(settings, reason) {
    await this.client.rest.patch(Routes.guildWidgetSettings(this.id), {
      body: {
        enabled: settings.enabled,
        channel_id: this.channels.resolveId(settings.channel),
      },
      reason,
    });
    return this;
  }

  /**
   * Sets the guild's MFA level
   * <info>An elevated MFA level requires guild moderators to have 2FA enabled.</info>
   * @param {GuildMFALevel} level The MFA level
   * @param {string} [reason] Reason for changing the guild's MFA level
   * @returns {Promise<Guild>}
   * @example
   * // Set the MFA level of the guild to Elevated
   * guild.setMFALevel(GuildMFALevel.Elevated)
   *   .then(guild => console.log("Set guild's MFA level to Elevated"))
   *   .catch(console.error);
   */
  async setMFALevel(level, reason) {
    await this.client.rest.post(Routes.guildMFA(this.id), {
      body: {
        level,
      },
      reason,
    });
    return this;
  }

  /**
   * Leaves the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Leave a guild
   * guild.leave()
   *   .then(guild => console.log(`Left the guild: ${guild.name}`))
   *   .catch(console.error);
   */
  async leave() {
    if (this.ownerId === this.client.user.id) throw new DiscordjsError(ErrorCodes.GuildOwned);
    await this.client.rest.delete(Routes.userGuild(this.id));
    return this;
  }

  /**
   * Deletes the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Delete a guild
   * guild.delete()
   *   .then(guild => console.log(`Deleted the guild ${guild}`))
   *   .catch(console.error);
   */
  async delete() {
    await this.client.rest.delete(Routes.guild(this.id));
    return this;
  }

  /**
   * Sets whether this guild's invites are disabled.
   * @param {boolean} [disabled=true] Whether the invites are disabled
   * @returns {Promise<Guild>}
   */
  async disableInvites(disabled = true) {
    const features = this.features.filter(feature => feature !== GuildFeature.InvitesDisabled);
    if (disabled) features.push(GuildFeature.InvitesDisabled);
    return this.edit({ features });
  }

  /**
   * Sets the incident actions for a guild.
   * @param {IncidentActionsEditOptions} incidentActions The incident actions to set
   * @returns {Promise<IncidentActions>}
   */
  async setIncidentActions(incidentActions) {
    return this.client.guilds.setIncidentActions(this.id, incidentActions);
  }

  /**
   * Whether this guild equals another guild. It compares all properties, so for most operations
   * it is advisable to just compare `guild.id === guild2.id` as it is much faster and is often
   * what most users need.
   * @param {Guild} guild The guild to compare with
   * @returns {boolean}
   */
  equals(guild) {
    return (
      guild &&
      guild instanceof this.constructor &&
      this.id === guild.id &&
      this.available === guild.available &&
      this.splash === guild.splash &&
      this.discoverySplash === guild.discoverySplash &&
      this.name === guild.name &&
      this.memberCount === guild.memberCount &&
      this.large === guild.large &&
      this.icon === guild.icon &&
      this.ownerId === guild.ownerId &&
      this.verificationLevel === guild.verificationLevel &&
      (this.features === guild.features ||
        (this.features.length === guild.features.length &&
          this.features.every((feat, i) => feat === guild.features[i])))
    );
  }

  toJSON() {
    const json = super.toJSON({
      available: false,
      createdTimestamp: true,
      nameAcronym: true,
      presences: false,
      voiceStates: false,
    });
    json.iconURL = this.iconURL();
    json.splashURL = this.splashURL();
    json.discoverySplashURL = this.discoverySplashURL();
    json.bannerURL = this.bannerURL();
    return json;
  }

  /**
   * The voice state adapter for this guild that can be used with `@discordjs/voice` to play audio in voice
   * and stage channels.
   * @type {Function}
   * @readonly
   */
  get voiceAdapterCreator() {
    return methods => {
      this.client.voice.adapters.set(this.id, methods);
      return {
        sendPayload: data => {
          if (this.shard.status !== Status.Ready) return false;
          this.shard.send(data);
          return true;
        },
        destroy: () => {
          this.client.voice.adapters.delete(this.id);
        },
      };
    };
  }

  /**
   * Creates a collection of this guild's roles, sorted by their position and ids.
   * @returns {Collection<Snowflake, Role>}
   * @private
   */
  _sortedRoles() {
    return discordSort(this.roles.cache);
  }

  /**
   * Creates a collection of this guild's or a specific category's channels, sorted by their position and ids.
   * @param {GuildChannel} [channel] Category to get the channels of
   * @returns {Collection<Snowflake, GuildChannel>}
   * @private
   */
  _sortedChannels(channel) {
    const channelIsCategory = channel.type === ChannelType.GuildCategory;
    const types = getSortableGroupTypes(channel.type);
    return discordSort(
      this.channels.cache.filter(
        ({ parentId, type }) => types.includes(type) && (channelIsCategory || parentId === channel.parentId),
      ),
    );
  }
}

exports.Guild = Guild;
