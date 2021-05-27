'use strict';

const Base = require('./Base');
const GuildAuditLogs = require('./GuildAuditLogs');
const GuildPreview = require('./GuildPreview');
const GuildTemplate = require('./GuildTemplate');
const Integration = require('./Integration');
const Invite = require('./Invite');
const VoiceRegion = require('./VoiceRegion');
const Webhook = require('./Webhook');
const { Error, TypeError } = require('../errors');
const GuildApplicationCommandManager = require('../managers/GuildApplicationCommandManager');
const GuildBanManager = require('../managers/GuildBanManager');
const GuildChannelManager = require('../managers/GuildChannelManager');
const GuildEmojiManager = require('../managers/GuildEmojiManager');
const GuildMemberManager = require('../managers/GuildMemberManager');
const PresenceManager = require('../managers/PresenceManager');
const RoleManager = require('../managers/RoleManager');
const VoiceStateManager = require('../managers/VoiceStateManager');
const Collection = require('../util/Collection');
const {
  ChannelTypes,
  DefaultMessageNotifications,
  PartialTypes,
  VerificationLevels,
  ExplicitContentFilterLevels,
  NSFWLevels,
} = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const SnowflakeUtil = require('../util/SnowflakeUtil');
const SystemChannelFlags = require('../util/SystemChannelFlags');
const Util = require('../util/Util');

/**
 * Represents a guild (or a server) on Discord.
 * <info>It's recommended to see if a guild is available before performing operations or reading data from it. You can
 * check this with `guild.available`.</info>
 * @extends {Base}
 */
class Guild extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the guild
   */
  constructor(client, data) {
    super(client);

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
     * Whether the bot has been removed from the guild
     * @type {boolean}
     */
    this.deleted = false;

    if (!data) return;
    if (data.unavailable) {
      /**
       * Whether the guild is available to access. If it is not available, it indicates a server outage
       * @type {boolean}
       */
      this.available = false;

      /**
       * The Unique ID of the guild, useful for comparisons
       * @type {Snowflake}
       */
      this.id = data.id;
    } else {
      this._patch(data);
      if (!data.channels) this.available = false;
    }

    /**
     * The id of the shard this Guild belongs to.
     * @type {number}
     */
    this.shardID = data.shardID;
  }

  /**
   * The Shard this Guild belongs to.
   * @type {WebSocketShard}
   * @readonly
   */
  get shard() {
    return this.client.ws.shards.get(this.shardID);
  }

  /**
   * Sets up the guild.
   * @param {*} data The raw data of the guild
   * @private
   */
  _patch(data) {
    /**
     * The name of the guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of the guild icon
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The hash of the guild invite splash image
     * @type {?string}
     */
    this.splash = data.splash;

    /**
     * The hash of the guild discovery splash image
     * @type {?string}
     */
    this.discoverySplash = data.discovery_splash;

    /**
     * The region the guild is located in
     * @type {string}
     */
    this.region = data.region;

    /**
     * The full amount of members in this guild
     * @type {number}
     */
    this.memberCount = data.member_count || this.memberCount;

    if ('nsfw_level' in data) {
      /**
       * The NSFW level of this guild
       * @type {NSFWLevel}
       */
      this.nsfwLevel = NSFWLevels[data.nsfw_level];
    }

    /**
     * Whether the guild is "large" (has more than large_threshold members, 50 by default)
     * @type {boolean}
     */
    this.large = Boolean('large' in data ? data.large : this.large);

    /**
     * An array of enabled guild features, here are the possible values:
     * * ANIMATED_ICON
     * * BANNER
     * * COMMERCE
     * * COMMUNITY
     * * DISCOVERABLE
     * * FEATURABLE
     * * INVITE_SPLASH
     * * MEMBER_VERIFICATION_GATE_ENABLED
     * * NEWS
     * * PARTNERED
     * * PREVIEW_ENABLED
     * * RELAY_ENABLED
     * * VANITY_URL
     * * VERIFIED
     * * VIP_REGIONS
     * * WELCOME_SCREEN_ENABLED
     * @typedef {string} Features
     */

    /**
     * An array of guild features available to the guild
     * @type {Features[]}
     */
    this.features = data.features;

    /**
     * The ID of the application that created this guild (if applicable)
     * @type {?Snowflake}
     */
    this.applicationID = data.application_id;

    /**
     * The time in seconds before a user is counted as "away from keyboard"
     * @type {?number}
     */
    this.afkTimeout = data.afk_timeout;

    /**
     * The ID of the voice channel where AFK members are moved
     * @type {?Snowflake}
     */
    this.afkChannelID = data.afk_channel_id;

    /**
     * The ID of the system channel
     * @type {?Snowflake}
     */
    this.systemChannelID = data.system_channel_id;

    /**
     * The type of premium tier:
     * * 0: NONE
     * * 1: TIER_1
     * * 2: TIER_2
     * * 3: TIER_3
     * @typedef {number} PremiumTier
     */

    /**
     * The premium tier on this guild
     * @type {PremiumTier}
     */
    this.premiumTier = data.premium_tier;

    if (typeof data.premium_subscription_count !== 'undefined') {
      /**
       * The total number of boosts for this server
       * @type {?number}
       */
      this.premiumSubscriptionCount = data.premium_subscription_count;
    }

    if (typeof data.widget_enabled !== 'undefined') {
      /**
       * Whether widget images are enabled on this guild
       * @type {?boolean}
       */
      this.widgetEnabled = data.widget_enabled;
    }

    if (typeof data.widget_channel_id !== 'undefined') {
      /**
       * The widget channel ID, if enabled
       * @type {?string}
       */
      this.widgetChannelID = data.widget_channel_id;
    }

    /**
     * The verification level of the guild
     * @type {VerificationLevel}
     */
    this.verificationLevel = VerificationLevels[data.verification_level];

    /**
     * The explicit content filter level of the guild
     * @type {ExplicitContentFilterLevel}
     */
    this.explicitContentFilter = ExplicitContentFilterLevels[data.explicit_content_filter];

    /**
     * The required MFA level for the guild
     * @type {number}
     */
    this.mfaLevel = data.mfa_level;

    /**
     * The timestamp the client user joined the guild at
     * @type {number}
     */
    this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

    /**
     * The value set for the guild's default message notifications
     * @type {DefaultMessageNotifications|number}
     */
    this.defaultMessageNotifications =
      DefaultMessageNotifications[data.default_message_notifications] || data.default_message_notifications;

    /**
     * The value set for the guild's system channel flags
     * @type {Readonly<SystemChannelFlags>}
     */
    this.systemChannelFlags = new SystemChannelFlags(data.system_channel_flags).freeze();

    if (typeof data.max_members !== 'undefined') {
      /**
       * The maximum amount of members the guild can have
       * @type {?number}
       */
      this.maximumMembers = data.max_members;
    } else if (typeof this.maximumMembers === 'undefined') {
      this.maximumMembers = null;
    }

    if (typeof data.max_presences !== 'undefined') {
      /**
       * The maximum amount of presences the guild can have
       * <info>You will need to fetch the guild using {@link Guild#fetch} if you want to receive this parameter</info>
       * @type {?number}
       */
      this.maximumPresences = data.max_presences || 25000;
    } else if (typeof this.maximumPresences === 'undefined') {
      this.maximumPresences = null;
    }

    if (typeof data.approximate_member_count !== 'undefined') {
      /**
       * The approximate amount of members the guild has
       * <info>You will need to fetch the guild using {@link Guild#fetch} if you want to receive this parameter</info>
       * @type {?number}
       */
      this.approximateMemberCount = data.approximate_member_count;
    } else if (typeof this.approximateMemberCount === 'undefined') {
      this.approximateMemberCount = null;
    }

    if (typeof data.approximate_presence_count !== 'undefined') {
      /**
       * The approximate amount of presences the guild has
       * <info>You will need to fetch the guild using {@link Guild#fetch} if you want to receive this parameter</info>
       * @type {?number}
       */
      this.approximatePresenceCount = data.approximate_presence_count;
    } else if (typeof this.approximatePresenceCount === 'undefined') {
      this.approximatePresenceCount = null;
    }

    /**
     * The vanity invite code of the guild, if any
     * @type {?string}
     */
    this.vanityURLCode = data.vanity_url_code;

    /**
     * The use count of the vanity URL code of the guild, if any
     * <info>You will need to fetch this parameter using {@link Guild#fetchVanityData} if you want to receive it</info>
     * @type {?number}
     */
    this.vanityURLUses = null;

    /**
     * The description of the guild, if any
     * @type {?string}
     */
    this.description = data.description;

    /**
     * The hash of the guild banner
     * @type {?string}
     */
    this.banner = data.banner;

    this.id = data.id;
    this.available = !data.unavailable;
    this.features = data.features || this.features || [];

    /**
     * The ID of the rules channel for the guild
     * @type {?Snowflake}
     */
    this.rulesChannelID = data.rules_channel_id;

    /**
     * The ID of the community updates channel for the guild
     * @type {?Snowflake}
     */
    this.publicUpdatesChannelID = data.public_updates_channel_id;

    /**
     * The preferred locale of the guild, defaults to `en-US`
     * @type {string}
     */
    this.preferredLocale = data.preferred_locale;

    if (data.channels) {
      this.channels.cache.clear();
      for (const rawChannel of data.channels) {
        this.client.channels.add(rawChannel, this);
      }
    }

    if (data.roles) {
      this.roles.cache.clear();
      for (const role of data.roles) this.roles.add(role);
    }

    if (data.members) {
      this.members.cache.clear();
      for (const guildUser of data.members) this.members.add(guildUser);
    }

    if (data.owner_id) {
      /**
       * The user ID of this guild's owner
       * @type {Snowflake}
       */
      this.ownerID = data.owner_id;
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this.presences.add(Object.assign(presence, { guild: this }));
      }
    }

    if (data.voice_states) {
      this.voiceStates.cache.clear();
      for (const voiceState of data.voice_states) {
        this.voiceStates.add(voiceState);
      }
    }

    if (!this.emojis) {
      /**
       * A manager of the emojis belonging to this guild
       * @type {GuildEmojiManager}
       */
      this.emojis = new GuildEmojiManager(this);
      if (data.emojis) for (const emoji of data.emojis) this.emojis.add(emoji);
    } else if (data.emojis) {
      this.client.actions.GuildEmojisUpdate.handle({
        guild_id: this.id,
        emojis: data.emojis,
      });
    }
  }

  /**
   * The URL to this guild's banner.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  bannerURL({ format, size } = {}) {
    if (!this.banner) return null;
    return this.client.rest.cdn.Banner(this.id, this.banner, format, size);
  }

  /**
   * The timestamp the guild was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
  }

  /**
   * The time the guild was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
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
   * If this guild is partnered
   * @type {boolean}
   * @readonly
   */
  get partnered() {
    return this.features.includes('PARTNERED');
  }

  /**
   * If this guild is verified
   * @type {boolean}
   * @readonly
   */
  get verified() {
    return this.features.includes('VERIFIED');
  }

  /**
   * The URL to this guild's icon.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  iconURL({ format, size, dynamic } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.Icon(this.id, this.icon, format, size, dynamic);
  }

  /**
   * The acronym that shows up in place of a guild icon.
   * @type {string}
   * @readonly
   */
  get nameAcronym() {
    return this.name
      .replace(/'s /g, ' ')
      .replace(/\w+/g, e => e[0])
      .replace(/\s/g, '');
  }

  /**
   * The URL to this guild's invite splash image.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  splashURL({ format, size } = {}) {
    if (!this.splash) return null;
    return this.client.rest.cdn.Splash(this.id, this.splash, format, size);
  }

  /**
   * The URL to this guild's discovery splash image.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  discoverySplashURL({ format, size } = {}) {
    if (!this.discoverySplash) return null;
    return this.client.rest.cdn.DiscoverySplash(this.id, this.discoverySplash, format, size);
  }

  /**
   * Options used to fetch the owner of guild.
   * @typedef {Object} FetchOwnerOptions
   * @property {boolean} [cache=true] Whether or not to cache the fetched member
   * @property {boolean} [force=false] Whether to skip the cache check and request the API
   */

  /**
   * Fetches the owner of the guild.
   * If the member object isn't needed, use {@link Guild#ownerID} instead.
   * @param {FetchOwnerOptions} [options] The options for fetching the member
   * @returns {Promise<GuildMember>}
   */
  fetchOwner(options) {
    return this.members.fetch({ ...options, user: this.ownerID });
  }

  /**
   * AFK voice channel for this guild
   * @type {?VoiceChannel}
   * @readonly
   */
  get afkChannel() {
    return this.client.channels.cache.get(this.afkChannelID) || null;
  }

  /**
   * System channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get systemChannel() {
    return this.client.channels.cache.get(this.systemChannelID) || null;
  }

  /**
   * Widget channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get widgetChannel() {
    return this.client.channels.cache.get(this.widgetChannelID) || null;
  }

  /**
   * Rules channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get rulesChannel() {
    return this.client.channels.cache.get(this.rulesChannelID) || null;
  }

  /**
   * Public updates channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get publicUpdatesChannel() {
    return this.client.channels.cache.get(this.publicUpdatesChannelID) || null;
  }

  /**
   * The client user as a GuildMember of this guild
   * @type {?GuildMember}
   * @readonly
   */
  get me() {
    return (
      this.members.cache.get(this.client.user.id) ||
      (this.client.options.partials.includes(PartialTypes.GUILD_MEMBER)
        ? this.members.add({ user: { id: this.client.user.id } }, true)
        : null)
    );
  }

  /**
   * Fetches this guild.
   * @returns {Promise<Guild>}
   */
  fetch() {
    return this.client.api
      .guilds(this.id)
      .get({ query: { with_counts: true } })
      .then(data => {
        this._patch(data);
        return this;
      });
  }

  /**
   * Fetches a collection of integrations to this guild.
   * Resolves with a collection mapping integrations by their ids.
   * @returns {Promise<Collection<string, Integration>>}
   * @example
   * // Fetch integrations
   * guild.fetchIntegrations()
   *   .then(integrations => console.log(`Fetched ${integrations.size} integrations`))
   *   .catch(console.error);
   */
  async fetchIntegrations() {
    const data = await this.client.api.guilds(this.id).integrations.get();
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
  fetchTemplates() {
    return this.client.api
      .guilds(this.id)
      .templates.get()
      .then(templates =>
        templates.reduce((col, data) => col.set(data.code, new GuildTemplate(this.client, data)), new Collection()),
      );
  }

  /**
   * The data for creating an integration.
   * @typedef {Object} IntegrationData
   * @property {string} id The integration id
   * @property {string} type The integration type
   */

  /**
   * Creates an integration by attaching an integration object
   * @param {IntegrationData} data The data for the integration
   * @param {string} reason Reason for creating the integration
   * @returns {Promise<Guild>}
   */
  createIntegration(data, reason) {
    return this.client.api
      .guilds(this.id)
      .integrations.post({ data, reason })
      .then(() => this);
  }

  /**
   * Creates a template for the guild.
   * @param {string} name The name for the template
   * @param {string} [description] The description for the template
   * @returns {Promise<GuildTemplate>}
   */
  createTemplate(name, description) {
    return this.client.api
      .guilds(this.id)
      .templates.post({ data: { name, description } })
      .then(data => new GuildTemplate(this.client, data));
  }

  /**
   * Fetches a collection of invites to this guild.
   * Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   * @example
   * // Fetch invites
   * guild.fetchInvites()
   *   .then(invites => console.log(`Fetched ${invites.size} invites`))
   *   .catch(console.error);
   * @example
   * // Fetch invite creator by their id
   * guild.fetchInvites()
   *  .then(invites => console.log(invites.find(invite => invite.inviter.id === '84484653687267328')))
   *  .catch(console.error);
   */
  fetchInvites() {
    return this.client.api
      .guilds(this.id)
      .invites.get()
      .then(inviteItems => {
        const invites = new Collection();
        for (const inviteItem of inviteItems) {
          const invite = new Invite(this.client, inviteItem);
          invites.set(invite.code, invite);
        }
        return invites;
      });
  }

  /**
   * Obtains a guild preview for this guild from Discord.
   * @returns {Promise<GuildPreview>}
   */
  fetchPreview() {
    return this.client.api
      .guilds(this.id)
      .preview.get()
      .then(data => new GuildPreview(this.client, data));
  }

  /**
   * An object containing information about a guild's vanity invite.
   * @typedef {Object} Vanity
   * @property {?string} code Vanity invite code
   * @property {?number} uses How many times this invite has been used
   */

  /**
   * Fetches the vanity url invite object to this guild.
   * Resolves with an object containing the vanity url invite code and the use count
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
    if (!this.features.includes('VANITY_URL')) {
      throw new Error('VANITY_URL');
    }
    const data = await this.client.api.guilds(this.id, 'vanity-url').get();
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
  fetchWebhooks() {
    return this.client.api
      .guilds(this.id)
      .webhooks.get()
      .then(data => {
        const hooks = new Collection();
        for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
        return hooks;
      });
  }

  /**
   * Fetches available voice regions.
   * @returns {Promise<Collection<string, VoiceRegion>>}
   */
  fetchVoiceRegions() {
    return this.client.api
      .guilds(this.id)
      .regions.get()
      .then(res => {
        const regions = new Collection();
        for (const region of res) regions.set(region.id, new VoiceRegion(region));
        return regions;
      });
  }

  /**
   * Data for the Guild Widget object
   * @typedef {Object} GuildWidget
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?GuildChannel} channel The widget channel
   */

  /**
   * The Guild Widget object
   * @typedef {Object} GuildWidgetData
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?GuildChannelResolvable} channel The widget channel
   */

  /**
   * Fetches the guild widget.
   * @returns {Promise<GuildWidget>}
   * @example
   * // Fetches the guild widget
   * guild.fetchWidget()
   *   .then(widget => console.log(`The widget is ${widget.enabled ? 'enabled' : 'disabled'}`))
   *   .catch(console.error);
   */
  async fetchWidget() {
    const data = await this.client.api.guilds(this.id).widget.get();
    this.widgetEnabled = data.enabled;
    this.widgetChannelID = data.channel_id;
    return {
      enabled: data.enabled,
      channel: data.channel_id ? this.channels.cache.get(data.channel_id) : null,
    };
  }

  /**
   * Fetches audit logs for this guild.
   * @param {Object} [options={}] Options for fetching audit logs
   * @param {Snowflake|GuildAuditLogsEntry} [options.before] Limit to entries from before specified entry
   * @param {number} [options.limit] Limit number of entries
   * @param {UserResolvable} [options.user] Only show entries involving this user
   * @param {AuditLogAction|number} [options.type] Only show entries involving this action type
   * @returns {Promise<GuildAuditLogs>}
   * @example
   * // Output audit log entries
   * guild.fetchAuditLogs()
   *   .then(audit => console.log(audit.entries.first()))
   *   .catch(console.error);
   */
  fetchAuditLogs(options = {}) {
    if (options.before && options.before instanceof GuildAuditLogs.Entry) options.before = options.before.id;
    if (typeof options.type === 'string') options.type = GuildAuditLogs.Actions[options.type];

    return this.client.api
      .guilds(this.id)
      ['audit-logs'].get({
        query: {
          before: options.before,
          limit: options.limit,
          user_id: this.client.users.resolveID(options.user),
          action_type: options.type,
        },
      })
      .then(data => GuildAuditLogs.build(this, data));
  }

  /**
   * Adds a user to the guild using OAuth2. Requires the `CREATE_INSTANT_INVITE` permission.
   * @param {UserResolvable} user User to add to the guild
   * @param {Object} options Options for the addition
   * @param {string} options.accessToken An OAuth2 access token for the user with the `guilds.join` scope granted to the
   * bot's application
   * @param {string} [options.nick] Nickname to give the member (requires `MANAGE_NICKNAMES`)
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} [options.roles] Roles to add to the member
   * (requires `MANAGE_ROLES`)
   * @param {boolean} [options.mute] Whether the member should be muted (requires `MUTE_MEMBERS`)
   * @param {boolean} [options.deaf] Whether the member should be deafened (requires `DEAFEN_MEMBERS`)
   * @returns {Promise<GuildMember>}
   */
  async addMember(user, options) {
    user = this.client.users.resolveID(user);
    if (!user) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable');
    if (this.members.cache.has(user)) return this.members.cache.get(user);
    options.access_token = options.accessToken;
    if (options.roles) {
      if (!Array.isArray(options.roles) && !(options.roles instanceof Collection)) {
        throw new TypeError('INVALID_TYPE', 'options.roles', 'Array or Collection of Roles or Snowflakes', true);
      }
      const resolvedRoles = [];
      for (const role of options.roles.values()) {
        const resolvedRole = this.roles.resolveID(role);
        if (!role) throw new TypeError('INVALID_ELEMENT', 'Array or Collection', 'options.roles', role);
        resolvedRoles.push(resolvedRole);
      }
      options.roles = resolvedRoles;
    }
    const data = await this.client.api.guilds(this.id).members(user).put({ data: options });
    // Data is an empty buffer if the member is already part of the guild.
    return data instanceof Buffer ? this.members.fetch(user) : this.members.add(data);
  }

  /**
   * The data for editing a guild.
   * @typedef {Object} GuildEditData
   * @property {string} [name] The name of the guild
   * @property {string} [region] The region of the guild
   * @property {VerificationLevel|number} [verificationLevel] The verification level of the guild
   * @property {ExplicitContentFilterLevel|number} [explicitContentFilter] The level of the explicit content filter
   * @property {ChannelResolvable} [afkChannel] The AFK channel of the guild
   * @property {ChannelResolvable} [systemChannel] The system channel of the guild
   * @property {number} [afkTimeout] The AFK timeout of the guild
   * @property {Base64Resolvable} [icon] The icon of the guild
   * @property {GuildMemberResolvable} [owner] The owner of the guild
   * @property {Base64Resolvable} [splash] The invite splash image of the guild
   * @property {Base64Resolvable} [discoverySplash] The discovery splash image of the guild
   * @property {Base64Resolvable} [banner] The banner of the guild
   * @property {DefaultMessageNotifications|number} [defaultMessageNotifications] The default message notifications
   * @property {SystemChannelFlagsResolvable} [systemChannelFlags] The system channel flags of the guild
   * @property {ChannelResolvable} [rulesChannel] The rules channel of the guild
   * @property {ChannelResolvable} [publicUpdatesChannel] The community updates channel of the guild
   * @property {string} [preferredLocale] The preferred locale of the guild
   * @property {string} [description] The discovery description of the guild
   * @property {Features[]} [features] The features of the guild
   */

  /**
   * Updates the guild with new information - e.g. a new name.
   * @param {GuildEditData} data The data to update the guild with
   * @param {string} [reason] Reason for editing this guild
   * @returns {Promise<Guild>}
   * @example
   * // Set the guild name and region
   * guild.edit({
   *   name: 'Discord Guild',
   *   region: 'london',
   * })
   *   .then(updated => console.log(`New guild name ${updated} in region ${updated.region}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    const _data = {};
    if (data.name) _data.name = data.name;
    if (data.region) _data.region = data.region;
    if (typeof data.verificationLevel !== 'undefined') {
      _data.verification_level =
        typeof data.verificationLevel === 'number'
          ? Number(data.verificationLevel)
          : VerificationLevels.indexOf(data.verificationLevel);
    }
    if (typeof data.afkChannel !== 'undefined') {
      _data.afk_channel_id = this.client.channels.resolveID(data.afkChannel);
    }
    if (typeof data.systemChannel !== 'undefined') {
      _data.system_channel_id = this.client.channels.resolveID(data.systemChannel);
    }
    if (data.afkTimeout) _data.afk_timeout = Number(data.afkTimeout);
    if (typeof data.icon !== 'undefined') _data.icon = data.icon;
    if (data.owner) _data.owner_id = this.client.users.resolveID(data.owner);
    if (data.splash) _data.splash = data.splash;
    if (data.discoverySplash) _data.discovery_splash = data.discoverySplash;
    if (data.banner) _data.banner = data.banner;
    if (typeof data.explicitContentFilter !== 'undefined') {
      _data.explicit_content_filter =
        typeof data.explicitContentFilter === 'number'
          ? data.explicitContentFilter
          : ExplicitContentFilterLevels.indexOf(data.explicitContentFilter);
    }
    if (typeof data.defaultMessageNotifications !== 'undefined') {
      _data.default_message_notifications =
        typeof data.defaultMessageNotifications === 'string'
          ? DefaultMessageNotifications.indexOf(data.defaultMessageNotifications)
          : data.defaultMessageNotifications;
    }
    if (typeof data.systemChannelFlags !== 'undefined') {
      _data.system_channel_flags = SystemChannelFlags.resolve(data.systemChannelFlags);
    }
    if (typeof data.rulesChannel !== 'undefined') {
      _data.rules_channel_id = this.client.channels.resolveID(data.rulesChannel);
    }
    if (typeof data.publicUpdatesChannel !== 'undefined') {
      _data.public_updates_channel_id = this.client.channels.resolveID(data.publicUpdatesChannel);
    }
    if (typeof data.features !== 'undefined') {
      _data.features = data.features;
    }
    if (typeof data.description !== 'undefined') {
      _data.description = data.description;
    }
    if (data.preferredLocale) _data.preferred_locale = data.preferredLocale;
    return this.client.api
      .guilds(this.id)
      .patch({ data: _data, reason })
      .then(newData => this.client.actions.GuildUpdate.handle(newData).updated);
  }

  /**
   * Edits the level of the explicit content filter.
   * @param {ExplicitContentFilterLevel|number} explicitContentFilter The new level of the explicit content filter
   * @param {string} [reason] Reason for changing the level of the guild's explicit content filter
   * @returns {Promise<Guild>}
   */
  setExplicitContentFilter(explicitContentFilter, reason) {
    return this.edit({ explicitContentFilter }, reason);
  }

  /* eslint-disable max-len */
  /**
   * Edits the setting of the default message notifications of the guild.
   * @param {DefaultMessageNotifications|number} defaultMessageNotifications The new setting for the default message notifications
   * @param {string} [reason] Reason for changing the setting of the default message notifications
   * @returns {Promise<Guild>}
   */
  setDefaultMessageNotifications(defaultMessageNotifications, reason) {
    return this.edit({ defaultMessageNotifications }, reason);
  }
  /* eslint-enable max-len */

  /**
   * Edits the flags of the default message notifications of the guild.
   * @param {SystemChannelFlagsResolvable} systemChannelFlags The new flags for the default message notifications
   * @param {string} [reason] Reason for changing the flags of the default message notifications
   * @returns {Promise<Guild>}
   */
  setSystemChannelFlags(systemChannelFlags, reason) {
    return this.edit({ systemChannelFlags }, reason);
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
    return this.edit({ name }, reason);
  }

  /**
   * Edits the region of the guild.
   * @param {string} region The new region of the guild
   * @param {string} [reason] Reason for changing the guild's region
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild region
   * guild.setRegion('london')
   *  .then(updated => console.log(`Updated guild region to ${updated.region}`))
   *  .catch(console.error);
   */
  setRegion(region, reason) {
    return this.edit({ region }, reason);
  }

  /**
   * Edits the verification level of the guild.
   * @param {VerificationLevel|number} verificationLevel The new verification level of the guild
   * @param {string} [reason] Reason for changing the guild's verification level
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild verification level
   * guild.setVerificationLevel(1)
   *  .then(updated => console.log(`Updated guild verification level to ${guild.verificationLevel}`))
   *  .catch(console.error);
   */
  setVerificationLevel(verificationLevel, reason) {
    return this.edit({ verificationLevel }, reason);
  }

  /**
   * Edits the AFK channel of the guild.
   * @param {ChannelResolvable} afkChannel The new AFK channel
   * @param {string} [reason] Reason for changing the guild's AFK channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated guild AFK channel to ${guild.afkChannel.name}`))
   *  .catch(console.error);
   */
  setAFKChannel(afkChannel, reason) {
    return this.edit({ afkChannel }, reason);
  }

  /**
   * Edits the system channel of the guild.
   * @param {ChannelResolvable} systemChannel The new system channel
   * @param {string} [reason] Reason for changing the guild's system channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild system channel
   * guild.setSystemChannel(channel)
   *  .then(updated => console.log(`Updated guild system channel to ${guild.systemChannel.name}`))
   *  .catch(console.error);
   */
  setSystemChannel(systemChannel, reason) {
    return this.edit({ systemChannel }, reason);
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
    return this.edit({ afkTimeout }, reason);
  }

  /**
   * Sets a new guild icon.
   * @param {Base64Resolvable|BufferResolvable} icon The new icon of the guild
   * @param {string} [reason] Reason for changing the guild's icon
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild icon
   * guild.setIcon('./icon.png')
   *  .then(updated => console.log('Updated the guild icon'))
   *  .catch(console.error);
   */
  async setIcon(icon, reason) {
    return this.edit({ icon: await DataResolver.resolveImage(icon) }, reason);
  }

  /**
   * Sets a new owner of the guild.
   * @param {GuildMemberResolvable} owner The new owner of the guild
   * @param {string} [reason] Reason for setting the new owner
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild owner
   * guild.setOwner(guild.members.cache.first())
   *  .then(updated => console.log(`Updated the guild owner to ${updated.owner.displayName}`))
   *  .catch(console.error);
   */
  setOwner(owner, reason) {
    return this.edit({ owner }, reason);
  }

  /**
   * Sets a new guild invite splash image.
   * @param {Base64Resolvable|BufferResolvable} splash The new invite splash image of the guild
   * @param {string} [reason] Reason for changing the guild's invite splash image
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild splash
   * guild.setSplash('./splash.png')
   *  .then(updated => console.log('Updated the guild splash'))
   *  .catch(console.error);
   */
  async setSplash(splash, reason) {
    return this.edit({ splash: await DataResolver.resolveImage(splash) }, reason);
  }

  /**
   * Sets a new guild discovery splash image.
   * @param {Base64Resolvable|BufferResolvable} discoverySplash The new discovery splash image of the guild
   * @param {string} [reason] Reason for changing the guild's discovery splash image
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild discovery splash
   * guild.setDiscoverySplash('./discoverysplash.png')
   *   .then(updated => console.log('Updated the guild discovery splash'))
   *   .catch(console.error);
   */
  async setDiscoverySplash(discoverySplash, reason) {
    return this.edit({ discoverySplash: await DataResolver.resolveImage(discoverySplash) }, reason);
  }

  /**
   * Sets a new guild banner.
   * @param {Base64Resolvable|BufferResolvable} banner The new banner of the guild
   * @param {string} [reason] Reason for changing the guild's banner
   * @returns {Promise<Guild>}
   * @example
   * guild.setBanner('./banner.png')
   *  .then(updated => console.log('Updated the guild banner'))
   *  .catch(console.error);
   */
  async setBanner(banner, reason) {
    return this.edit({ banner: await DataResolver.resolveImage(banner) }, reason);
  }

  /**
   * Edits the rules channel of the guild.
   * @param {ChannelResolvable} rulesChannel The new rules channel
   * @param {string} [reason] Reason for changing the guild's rules channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild rules channel
   * guild.setRulesChannel(channel)
   *  .then(updated => console.log(`Updated guild rules channel to ${guild.rulesChannel.name}`))
   *  .catch(console.error);
   */
  setRulesChannel(rulesChannel, reason) {
    return this.edit({ rulesChannel }, reason);
  }

  /**
   * Edits the community updates channel of the guild.
   * @param {ChannelResolvable} publicUpdatesChannel The new community updates channel
   * @param {string} [reason] Reason for changing the guild's community updates channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild community updates channel
   * guild.setPublicUpdatesChannel(channel)
   *  .then(updated => console.log(`Updated guild community updates channel to ${guild.publicUpdatesChannel.name}`))
   *  .catch(console.error);
   */
  setPublicUpdatesChannel(publicUpdatesChannel, reason) {
    return this.edit({ publicUpdatesChannel }, reason);
  }

  /**
   * Edits the preferred locale of the guild.
   * @param {string} preferredLocale The new preferred locale of the guild
   * @param {string} [reason] Reason for changing the guild's preferred locale
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild preferred locale
   * guild.setPreferredLocale('en-US')
   *  .then(updated => console.log(`Updated guild preferred locale to ${guild.preferredLocale}`))
   *  .catch(console.error);
   */
  setPreferredLocale(preferredLocale, reason) {
    return this.edit({ preferredLocale }, reason);
  }

  /**
   * Data that can be resolved to give a Category Channel object. This can be:
   * * A CategoryChannel object
   * * A Snowflake
   * @typedef {CategoryChannel|Snowflake} CategoryChannelResolvable
   */

  /**
   * The data needed for updating a channel's position.
   * @typedef {Object} ChannelPosition
   * @property {ChannelResolvable} channel Channel to update
   * @property {number} [position] New position for the channel
   * @property {CategoryChannelResolvable} [parent] Parent channel for this channel
   * @property {boolean} [lockPermissions] If the overwrites should be locked to the parents overwrites
   */

  /**
   * Batch-updates the guild's channels' positions.
   * <info>Only one channel's parent can be changed at a time</info>
   * @param {ChannelPosition[]} channelPositions Channel positions to update
   * @returns {Promise<Guild>}
   * @example
   * guild.setChannelPositions([{ channel: channelID, position: newChannelIndex }])
   *   .then(guild => console.log(`Updated channel positions for ${guild}`))
   *   .catch(console.error);
   */
  setChannelPositions(channelPositions) {
    const updatedChannels = channelPositions.map(r => ({
      id: this.client.channels.resolveID(r.channel),
      position: r.position,
      lock_permissions: r.lockPermissions,
      parent_id: this.channels.resolveID(r.parent),
    }));

    return this.client.api
      .guilds(this.id)
      .channels.patch({ data: updatedChannels })
      .then(
        () =>
          this.client.actions.GuildChannelsPositionUpdate.handle({
            guild_id: this.id,
            channels: updatedChannels,
          }).guild,
      );
  }

  /**
   * The data needed for updating a guild role's position
   * @typedef {Object} GuildRolePosition
   * @property {RoleResolveable} role The ID of the role
   * @property {number} position The position to update
   */

  /**
   * Batch-updates the guild's role positions
   * @param {GuildRolePosition[]} rolePositions Role positions to update
   * @returns {Promise<Guild>}
   * @example
   * guild.setRolePositions([{ role: roleID, position: updatedRoleIndex }])
   *  .then(guild => console.log(`Role positions updated for ${guild}`))
   *  .catch(console.error);
   */
  setRolePositions(rolePositions) {
    // Make sure rolePositions are prepared for API
    rolePositions = rolePositions.map(o => ({
      id: this.roles.resolveID(o.role),
      position: o.position,
    }));

    // Call the API to update role positions
    return this.client.api
      .guilds(this.id)
      .roles.patch({
        data: rolePositions,
      })
      .then(
        () =>
          this.client.actions.GuildRolesPositionUpdate.handle({
            guild_id: this.id,
            roles: rolePositions,
          }).guild,
      );
  }

  /**
   * Edits the guild's widget.
   * @param {GuildWidgetData} widget The widget for the guild
   * @param {string} [reason] Reason for changing the guild's widget
   * @returns {Promise<Guild>}
   */
  setWidget(widget, reason) {
    return this.client.api
      .guilds(this.id)
      .widget.patch({
        data: {
          enabled: widget.enabled,
          channel_id: this.channels.resolveID(widget.channel),
        },
        reason,
      })
      .then(() => this);
  }

  /**
   * Leaves the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Leave a guild
   * guild.leave()
   *   .then(g => console.log(`Left the guild ${g}`))
   *   .catch(console.error);
   */
  leave() {
    if (this.ownerID === this.client.user.id) return Promise.reject(new Error('GUILD_OWNED'));
    return this.client.api
      .users('@me')
      .guilds(this.id)
      .delete()
      .then(() => this.client.actions.GuildDelete.handle({ id: this.id }).guild);
  }

  /**
   * Deletes the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Delete a guild
   * guild.delete()
   *   .then(g => console.log(`Deleted the guild ${g}`))
   *   .catch(console.error);
   */
  delete() {
    return this.client.api
      .guilds(this.id)
      .delete()
      .then(() => this.client.actions.GuildDelete.handle({ id: this.id }).guild);
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
      this.region === guild.region &&
      this.name === guild.name &&
      this.memberCount === guild.memberCount &&
      this.large === guild.large &&
      this.icon === guild.icon &&
      this.ownerID === guild.ownerID &&
      this.verificationLevel === guild.verificationLevel &&
      (this.features === guild.features ||
        (this.features.length === guild.features.length &&
          this.features.every((feat, i) => feat === guild.features[i])))
    );
  }

  /**
   * When concatenated with a string, this automatically returns the guild's name instead of the Guild object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Guild!
   * console.log(`Hello from ${guild}!`);
   */
  toString() {
    return this.name;
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
   * Creates a collection of this guild's roles, sorted by their position and IDs.
   * @returns {Collection<Snowflake, Role>}
   * @private
   */
  _sortedRoles() {
    return Util.discordSort(this.roles.cache);
  }

  /**
   * Creates a collection of this guild's or a specific category's channels, sorted by their position and IDs.
   * @param {GuildChannel} [channel] Category to get the channels of
   * @returns {Collection<Snowflake, GuildChannel>}
   * @private
   */
  _sortedChannels(channel) {
    const category = channel.type === ChannelTypes.CATEGORY;
    return Util.discordSort(
      this.channels.cache.filter(
        c =>
          (['text', 'news', 'store'].includes(channel.type)
            ? ['text', 'news', 'store'].includes(c.type)
            : c.type === channel.type) &&
          (category || c.parent === channel.parent),
      ),
    );
  }
}

module.exports = Guild;
