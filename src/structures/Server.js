'use strict';

const { deprecate } = require('util');
const Base = require('./Base');
const Integration = require('./Integration');
const Invite = require('./Invite');
const ServerAuditLogs = require('./ServerAuditLogs');
const ServerPreview = require('./ServerPreview');
const ServerTemplate = require('./ServerTemplate');
const VoiceRegion = require('./VoiceRegion');
const Webhook = require('./Webhook');
const { Error, TypeError } = require('../errors');
const PresenceManager = require('../managers/PresenceManager');
const RoleManager = require('../managers/RoleManager');
const ServerChannelManager = require('../managers/ServerChannelManager');
const ServerEmojiManager = require('../managers/ServerEmojiManager');
const ServerMemberManager = require('../managers/ServerMemberManager');
const VoiceStateManager = require('../managers/VoiceStateManager');
const Collection = require('../util/Collection');
const {
  ChannelTypes,
  DefaultMessageNotifications,
  PartialTypes,
  VerificationLevels,
  ExplicitContentFilterLevels,
} = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const Snowflake = require('../util/Snowflake');
const SystemChannelFlags = require('../util/SystemChannelFlags');
const Util = require('../util/Util');

/**
 * Represents a server (or a server) on Discord.
 * <info>It's recommended to see if a server is available before performing operations or reading data from it. You can
 * check this with `server.available`.</info>
 * @extends {Base}
 */
class Server extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the server
   */
  constructor(client, data) {
    super(client);

    /**
     * A manager of the members belonging to this server
     * @type {ServerMemberManager}
     */
    this.members = new ServerMemberManager(this);

    /**
     * A manager of the channels belonging to this server
     * @type {ServerChannelManager}
     */
    this.channels = new ServerChannelManager(this);

    /**
     * A manager of the roles belonging to this server
     * @type {RoleManager}
     */
    this.roles = new RoleManager(this);

    /**
     * A manager of the presences belonging to this server
     * @type {PresenceManager}
     */
    this.presences = new PresenceManager(this.client);

    /**
     * A manager of the voice states of this server
     * @type {VoiceStateManager}
     */
    this.voiceStates = new VoiceStateManager(this);

    /**
     * Whether the bot has been removed from the server
     * @type {boolean}
     */
    this.deleted = false;

    if (!data) return;
    if (data.unavailable) {
      /**
       * Whether the server is available to access. If it is not available, it indicates a server outage
       * @type {boolean}
       */
      this.available = false;

      /**
       * The Unique ID of the server, useful for comparisons
       * @type {Snowflake}
       */
      this.id = data.id;
    } else {
      this._patch(data);
      if (!data.channels) this.available = false;
    }

    /**
     * The id of the shard this Server belongs to.
     * @type {number}
     */
    this.shardID = data.shardID;
  }

  /**
   * The Shard this Server belongs to.
   * @type {WebSocketShard}
   * @readonly
   */
  get shard() {
    return this.client.ws.shards.get(this.shardID);
  }

  /**
   * Sets up the server.
   * @param {*} data The raw data of the server
   * @private
   */
  _patch(data) {
    /**
     * The name of the server
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of the server icon
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The hash of the server invite splash image
     * @type {?string}
     */
    this.splash = data.splash;

    /**
     * The hash of the server discovery splash image
     * @type {?string}
     */
    this.discoverySplash = data.discovery_splash;

    /**
     * The region the server is located in
     * @type {string}
     */
    this.region = data.region;

    /**
     * The full amount of members in this server
     * @type {number}
     */
    this.memberCount = data.member_count || this.memberCount;

    /**
     * Whether the server is "large" (has more than large_threshold members, 50 by default)
     * @type {boolean}
     */
    this.large = Boolean('large' in data ? data.large : this.large);

    /**
     * An array of enabled server features, here are the possible values:
     * * ANIMATED_ICON
     * * BANNER
     * * COMMERCE
     * * COMMUNITY
     * * DISCOVERABLE
     * * FEATURABLE
     * * INVITE_SPLASH
     * * NEWS
     * * PARTNERED
     * * RELAY_ENABLED
     * * VANITY_URL
     * * VERIFIED
     * * VIP_REGIONS
     * * WELCOME_SCREEN_ENABLED
     * @typedef {string} Features
     */

    /**
     * An array of server features partnered servers have enabled
     * @type {Features[]}
     */
    this.features = data.features;

    /**
     * The ID of the application that created this server (if applicable)
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
     * Whether embedded images are enabled on this server
     * @type {boolean}
     * @deprecated
     */
    this.embedEnabled = data.embed_enabled;

    /**
     * The type of premium tier:
     * * 0: NONE
     * * 1: TIER_1
     * * 2: TIER_2
     * * 3: TIER_3
     * @typedef {number} PremiumTier
     */

    /**
     * The premium tier on this server
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
       * Whether widget images are enabled on this server
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

    if (typeof data.embed_channel_id !== 'undefined') {
      /**
       * The embed channel ID, if enabled
       * @type {?string}
       * @deprecated
       */
      this.embedChannelID = data.embed_channel_id;
    }

    /**
     * The verification level of the server
     * @type {VerificationLevel}
     */
    this.verificationLevel = VerificationLevels[data.verification_level];

    /**
     * The explicit content filter level of the server
     * @type {ExplicitContentFilterLevel}
     */
    this.explicitContentFilter = ExplicitContentFilterLevels[data.explicit_content_filter];

    /**
     * The required MFA level for the server
     * @type {number}
     */
    this.mfaLevel = data.mfa_level;

    /**
     * The timestamp the client user joined the server at
     * @type {number}
     */
    this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

    /**
     * The value set for the server's default message notifications
     * @type {DefaultMessageNotifications|number}
     */
    this.defaultMessageNotifications =
      DefaultMessageNotifications[data.default_message_notifications] || data.default_message_notifications;

    /**
     * The value set for the server's system channel flags
     * @type {Readonly<SystemChannelFlags>}
     */
    this.systemChannelFlags = new SystemChannelFlags(data.system_channel_flags).freeze();

    if (typeof data.max_members !== 'undefined') {
      /**
       * The maximum amount of members the server can have
       * @type {?number}
       */
      this.maximumMembers = data.max_members;
    } else if (typeof this.maximumMembers === 'undefined') {
      this.maximumMembers = null;
    }

    if (typeof data.max_presences !== 'undefined') {
      /**
       * The maximum amount of presences the server can have
       * <info>You will need to fetch the server using {@link Server#fetch} if you want to receive this parameter</info>
       * @type {?number}
       */
      this.maximumPresences = data.max_presences || 25000;
    } else if (typeof this.maximumPresences === 'undefined') {
      this.maximumPresences = null;
    }

    if (typeof data.approximate_member_count !== 'undefined') {
      /**
       * The approximate amount of members the server has
       * <info>You will need to fetch the server using {@link Server#fetch} if you want to receive this parameter</info>
       * @type {?number}
       */
      this.approximateMemberCount = data.approximate_member_count;
    } else if (typeof this.approximateMemberCount === 'undefined') {
      this.approximateMemberCount = null;
    }

    if (typeof data.approximate_presence_count !== 'undefined') {
      /**
       * The approximate amount of presences the server has
       * <info>You will need to fetch the server using {@link Server#fetch} if you want to receive this parameter</info>
       * @type {?number}
       */
      this.approximatePresenceCount = data.approximate_presence_count;
    } else if (typeof this.approximatePresenceCount === 'undefined') {
      this.approximatePresenceCount = null;
    }

    /**
     * The vanity invite code of the server, if any
     * @type {?string}
     */
    this.vanityURLCode = data.vanity_url_code;

    /* eslint-disable max-len */
    /**
     * The use count of the vanity URL code of the server, if any
     * <info>You will need to fetch this parameter using {@link Server#fetchVanityData} if you want to receive it</info>
     * @type {?number}
     */
    this.vanityURLUses = null;
    /* eslint-enable max-len */

    /**
     * The description of the server, if any
     * @type {?string}
     */
    this.description = data.description;

    /**
     * The hash of the server banner
     * @type {?string}
     */
    this.banner = data.banner;

    this.id = data.id;
    this.available = !data.unavailable;
    this.features = data.features || this.features || [];

    /**
     * The ID of the rules channel for the server
     * @type {?Snowflake}
     */
    this.rulesChannelID = data.rules_channel_id;

    /**
     * The ID of the community updates channel for the server
     * @type {?Snowflake}
     */
    this.publicUpdatesChannelID = data.public_updates_channel_id;

    /**
     * The preferred locale of the server, defaults to `en-US`
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
      for (const serverUser of data.members) this.members.add(serverUser);
    }

    if (data.owner_id) {
      /**
       * The user ID of this server's owner
       * @type {Snowflake}
       */
      this.ownerID = data.owner_id;
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this.presences.add(Object.assign(presence, { server: this }));
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
       * A manager of the emojis belonging to this server
       * @type {ServerEmojiManager}
       */
      this.emojis = new ServerEmojiManager(this);
      if (data.emojis) for (const emoji of data.emojis) this.emojis.add(emoji);
    } else if (data.emojis) {
      this.client.actions.ServerEmojisUpdate.handle({
        server_id: this.id,
        emojis: data.emojis,
      });
    }
  }

  /**
   * The URL to this server's banner.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  bannerURL({ format, size } = {}) {
    if (!this.banner) return null;
    return this.client.rest.cdn.Banner(this.id, this.banner, format, size);
  }

  /**
   * The timestamp the server was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the server was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the client user joined the server
   * @type {Date}
   * @readonly
   */
  get joinedAt() {
    return new Date(this.joinedTimestamp);
  }

  /**
   * If this server is partnered
   * @type {boolean}
   * @readonly
   */
  get partnered() {
    return this.features.includes('PARTNERED');
  }

  /**
   * If this server is verified
   * @type {boolean}
   * @readonly
   */
  get verified() {
    return this.features.includes('VERIFIED');
  }

  /**
   * The URL to this server's icon.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  iconURL({ format, size, dynamic } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.Icon(this.id, this.icon, format, size, dynamic);
  }

  /**
   * The acronym that shows up in place of a server icon.
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
   * The URL to this server's invite splash image.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  splashURL({ format, size } = {}) {
    if (!this.splash) return null;
    return this.client.rest.cdn.Splash(this.id, this.splash, format, size);
  }

  /**
   * The URL to this server's discovery splash image.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  discoverySplashURL({ format, size } = {}) {
    if (!this.discoverySplash) return null;
    return this.client.rest.cdn.DiscoverySplash(this.id, this.discoverySplash, format, size);
  }

  /**
   * The owner of the server
   * @type {?ServerMember}
   * @readonly
   */
  get owner() {
    return (
      this.members.cache.get(this.ownerID) ||
      (this.client.options.partials.includes(PartialTypes.GUILD_MEMBER)
        ? this.members.add({ user: { id: this.ownerID } }, true)
        : null)
    );
  }

  /**
   * AFK voice channel for this server
   * @type {?VoiceChannel}
   * @readonly
   */
  get afkChannel() {
    return this.client.channels.cache.get(this.afkChannelID) || null;
  }

  /**
   * System channel for this server
   * @type {?TextChannel}
   * @readonly
   */
  get systemChannel() {
    return this.client.channels.cache.get(this.systemChannelID) || null;
  }

  /**
   * Widget channel for this server
   * @type {?TextChannel}
   * @readonly
   */
  get widgetChannel() {
    return this.client.channels.cache.get(this.widgetChannelID) || null;
  }

  /**
   * Embed channel for this server
   * @type {?TextChannel}
   * @readonly
   * @deprecated
   */
  get embedChannel() {
    return this.client.channels.cache.get(this.embedChannelID) || null;
  }

  /**
   * Rules channel for this server
   * @type {?TextChannel}
   * @readonly
   */
  get rulesChannel() {
    return this.client.channels.cache.get(this.rulesChannelID) || null;
  }

  /**
   * Public updates channel for this server
   * @type {?TextChannel}
   * @readonly
   */
  get publicUpdatesChannel() {
    return this.client.channels.cache.get(this.publicUpdatesChannelID) || null;
  }

  /**
   * The client user as a ServerMember of this server
   * @type {?ServerMember}
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
   * Fetches this server.
   * @returns {Promise<Server>}
   */
  fetch() {
    return this.client.api
      .servers(this.id)
      .get({ query: { with_counts: true } })
      .then(data => {
        this._patch(data);
        return this;
      });
  }

  /**
   * An object containing information about a server member's ban.
   * @typedef {Object} BanInfo
   * @property {User} user User that was banned
   * @property {?string} reason Reason the user was banned
   */

  /**
   * Fetches information on a banned user from this server.
   * @param {UserResolvable} user The User to fetch the ban info of
   * @returns {Promise<BanInfo>}
   */
  fetchBan(user) {
    const id = this.client.users.resolveID(user);
    if (!id) throw new Error('FETCH_BAN_RESOLVE_ID');
    return this.client.api
      .servers(this.id)
      .bans(id)
      .get()
      .then(ban => ({
        reason: ban.reason,
        user: this.client.users.add(ban.user),
      }));
  }

  /**
   * Fetches a collection of banned users in this server.
   * @returns {Promise<Collection<Snowflake, BanInfo>>}
   */
  fetchBans() {
    return this.client.api
      .servers(this.id)
      .bans.get()
      .then(bans =>
        bans.reduce((collection, ban) => {
          collection.set(ban.user.id, {
            reason: ban.reason,
            user: this.client.users.add(ban.user),
          });
          return collection;
        }, new Collection()),
      );
  }

  /**
   * Fetches a collection of integrations to this server.
   * Resolves with a collection mapping integrations by their ids.
   * @param {Object} [options] Options for fetching integrations
   * @param {boolean} [options.includeApplications] Whether to include bot and Oauth2 webhook integrations
   * @returns {Promise<Collection<string, Integration>>}
   * @example
   * // Fetch integrations
   * server.fetchIntegrations()
   *   .then(integrations => console.log(`Fetched ${integrations.size} integrations`))
   *   .catch(console.error);
   */
  fetchIntegrations({ includeApplications = false } = {}) {
    return this.client.api
      .servers(this.id)
      .integrations.get({
        query: {
          include_applications: includeApplications,
        },
      })
      .then(data =>
        data.reduce(
          (collection, integration) => collection.set(integration.id, new Integration(this.client, integration, this)),
          new Collection(),
        ),
      );
  }

  /**
   * Fetches a collection of templates from this server.
   * Resolves with a collection mapping templates by their codes.
   * @returns {Promise<Collection<string, ServerTemplate>>}
   */
  fetchTemplates() {
    return this.client.api
      .servers(this.id)
      .templates.get()
      .then(templates =>
        templates.reduce((col, data) => col.set(data.code, new ServerTemplate(this.client, data)), new Collection()),
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
   * @returns {Promise<Server>}
   */
  createIntegration(data, reason) {
    return this.client.api
      .servers(this.id)
      .integrations.post({ data, reason })
      .then(() => this);
  }

  /**
   * Creates a template for the server.
   * @param {string} name The name for the template
   * @param {string} [description] The description for the template
   * @returns {Promise<ServerTemplate>}
   */
  createTemplate(name, description) {
    return this.client.api
      .servers(this.id)
      .templates.post({ data: { name, description } })
      .then(data => new ServerTemplate(this.client, data));
  }

  /**
   * Fetches a collection of invites to this server.
   * Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   * @example
   * // Fetch invites
   * server.fetchInvites()
   *   .then(invites => console.log(`Fetched ${invites.size} invites`))
   *   .catch(console.error);
   * @example
   * // Fetch invite creator by their id
   * server.fetchInvites()
   *  .then(invites => console.log(invites.find(invite => invite.inviter.id === '84484653687267328')))
   *  .catch(console.error);
   */
  fetchInvites() {
    return this.client.api
      .servers(this.id)
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
   * Obtains a server preview for this server from Discord.
   * @returns {Promise<ServerPreview>}
   */
  fetchPreview() {
    return this.client.api
      .servers(this.id)
      .preview.get()
      .then(data => new ServerPreview(this.client, data));
  }

  /**
   * Fetches the vanity url invite code to this server.
   * Resolves with a string matching the vanity url invite code, not the full url.
   * @returns {Promise<string>}
   * @deprecated
   * @example
   * // Fetch invites
   * server.fetchVanityCode()
   *   .then(code => {
   *     console.log(`Vanity URL: https://discord.gg/${code}`);
   *   })
   *   .catch(console.error);
   */
  fetchVanityCode() {
    return this.fetchVanityData().then(vanity => vanity.code);
  }

  /**
   * An object containing information about a server's vanity invite.
   * @typedef {Object} Vanity
   * @property {?string} code Vanity invite code
   * @property {?number} uses How many times this invite has been used
   */

  /**
   * Fetches the vanity url invite object to this server.
   * Resolves with an object containing the vanity url invite code and the use count
   * @returns {Promise<Vanity>}
   * @example
   * // Fetch invite data
   * server.fetchVanityData()
   *   .then(res => {
   *     console.log(`Vanity URL: https://discord.gg/${res.code} with ${res.uses} uses`);
   *   })
   *   .catch(console.error);
   */
  async fetchVanityData() {
    if (!this.features.includes('VANITY_URL')) {
      throw new Error('VANITY_URL');
    }
    const data = await this.client.api.servers(this.id, 'vanity-url').get();
    this.vanityURLUses = data.uses;

    return data;
  }

  /**
   * Fetches all webhooks for the server.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   * @example
   * // Fetch webhooks
   * server.fetchWebhooks()
   *   .then(webhooks => console.log(`Fetched ${webhooks.size} webhooks`))
   *   .catch(console.error);
   */
  fetchWebhooks() {
    return this.client.api
      .servers(this.id)
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
      .servers(this.id)
      .regions.get()
      .then(res => {
        const regions = new Collection();
        for (const region of res) regions.set(region.id, new VoiceRegion(region));
        return regions;
      });
  }

  /**
   * Data for the Server Widget object
   * @typedef {Object} ServerWidget
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?ServerChannel} channel The widget channel
   */

  /**
   * The Server Widget object
   * @typedef {Object} ServerWidgetData
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?ServerChannelResolvable} channel The widget channel
   */

  /**
   * Fetches the server embed.
   * @returns {Promise<ServerWidget>}
   * @deprecated
   * @example
   * // Fetches the server embed
   * server.fetchEmbed()
   *   .then(embed => console.log(`The embed is ${embed.enabled ? 'enabled' : 'disabled'}`))
   *   .catch(console.error);
   */
  fetchEmbed() {
    return this.fetchWidget();
  }

  /**
   * Fetches the server widget.
   * @returns {Promise<ServerWidget>}
   * @example
   * // Fetches the server widget
   * server.fetchWidget()
   *   .then(widget => console.log(`The widget is ${widget.enabled ? 'enabled' : 'disabled'}`))
   *   .catch(console.error);
   */
  async fetchWidget() {
    const data = await this.client.api.servers(this.id).widget.get();
    this.widgetEnabled = this.embedEnabled = data.enabled;
    this.widgetChannelID = this.embedChannelID = data.channel_id;
    return {
      enabled: data.enabled,
      channel: data.channel_id ? this.channels.cache.get(data.channel_id) : null,
    };
  }

  /**
   * Fetches audit logs for this server.
   * @param {Object} [options={}] Options for fetching audit logs
   * @param {Snowflake|ServerAuditLogsEntry} [options.before] Limit to entries from before specified entry
   * @param {number} [options.limit] Limit number of entries
   * @param {UserResolvable} [options.user] Only show entries involving this user
   * @param {AuditLogAction|number} [options.type] Only show entries involving this action type
   * @returns {Promise<ServerAuditLogs>}
   * @example
   * // Output audit log entries
   * server.fetchAuditLogs()
   *   .then(audit => console.log(audit.entries.first()))
   *   .catch(console.error);
   */
  fetchAuditLogs(options = {}) {
    if (options.before && options.before instanceof ServerAuditLogs.Entry) options.before = options.before.id;
    if (typeof options.type === 'string') options.type = ServerAuditLogs.Actions[options.type];

    return this.client.api
      .servers(this.id)
      ['audit-logs'].get({
        query: {
          before: options.before,
          limit: options.limit,
          user_id: this.client.users.resolveID(options.user),
          action_type: options.type,
        },
      })
      .then(data => ServerAuditLogs.build(this, data));
  }

  /**
   * Adds a user to the server using OAuth2. Requires the `CREATE_INSTANT_INVITE` permission.
   * @param {UserResolvable} user User to add to the server
   * @param {Object} options Options for the addition
   * @param {string} options.accessToken An OAuth2 access token for the user with the `servers.join` scope
   * granted to the bot's application
   * @param {string} [options.nick] Nickname to give the member (requires `MANAGE_NICKNAMES`)
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} [options.roles] Roles to add to the member
   * (requires `MANAGE_ROLES`)
   * @param {boolean} [options.mute] Whether the member should be muted (requires `MUTE_MEMBERS`)
   * @param {boolean} [options.deaf] Whether the member should be deafened (requires `DEAFEN_MEMBERS`)
   * @returns {Promise<ServerMember>}
   */
  async addMember(user, options) {
    user = this.client.users.resolveID(user);
    if (!user) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable');
    if (this.members.cache.has(user)) return this.members.cache.get(user);
    options.access_token = options.accessToken;
    if (options.roles) {
      const roles = [];
      for (let role of options.roles instanceof Collection ? options.roles.values() : options.roles) {
        role = this.roles.resolve(role);
        if (!role) {
          throw new TypeError('INVALID_TYPE', 'options.roles', 'Array or Collection of Roles or Snowflakes', true);
        }
        roles.push(role.id);
      }
      options.roles = roles;
    }
    const data = await this.client.api.servers(this.id).members(user).put({ data: options });
    // Data is an empty buffer if the member is already part of the server.
    return data instanceof Buffer ? this.members.fetch(user) : this.members.add(data);
  }

  /**
   * The data for editing a server.
   * @typedef {Object} ServerEditData
   * @property {string} [name] The name of the server
   * @property {string} [region] The region of the server
   * @property {VerificationLevel|number} [verificationLevel] The verification level of the server
   * @property {ExplicitContentFilterLevel|number} [explicitContentFilter] The level of the explicit content filter
   * @property {ChannelResolvable} [afkChannel] The AFK channel of the server
   * @property {ChannelResolvable} [systemChannel] The system channel of the server
   * @property {number} [afkTimeout] The AFK timeout of the server
   * @property {Base64Resolvable} [icon] The icon of the server
   * @property {ServerMemberResolvable} [owner] The owner of the server
   * @property {Base64Resolvable} [splash] The invite splash image of the server
   * @property {Base64Resolvable} [discoverySplash] The discovery splash image of the server
   * @property {Base64Resolvable} [banner] The banner of the server
   * @property {DefaultMessageNotifications|number} [defaultMessageNotifications] The default message notifications
   * @property {SystemChannelFlagsResolvable} [systemChannelFlags] The system channel flags of the server
   * @property {ChannelResolvable} [rulesChannel] The rules channel of the server
   * @property {ChannelResolvable} [publicUpdatesChannel] The community updates channel of the server
   * @property {string} [preferredLocale] The preferred locale of the server
   */

  /**
   * Updates the server with new information - e.g. a new name.
   * @param {ServerEditData} data The data to update the server with
   * @param {string} [reason] Reason for editing this server
   * @returns {Promise<Server>}
   * @example
   * // Set the server name and region
   * server.edit({
   *   name: 'Discord Server',
   *   region: 'london',
   * })
   *   .then(updated => console.log(`New server name ${updated} in region ${updated.region}`))
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
    if (data.preferredLocale) _data.preferred_locale = data.preferredLocale;
    return this.client.api
      .servers(this.id)
      .patch({ data: _data, reason })
      .then(newData => this.client.actions.ServerUpdate.handle(newData).updated);
  }

  /**
   * Edits the level of the explicit content filter.
   * @param {ExplicitContentFilterLevel|number} explicitContentFilter The new level of the explicit content filter
   * @param {string} [reason] Reason for changing the level of the server's explicit content filter
   * @returns {Promise<Server>}
   */
  setExplicitContentFilter(explicitContentFilter, reason) {
    return this.edit({ explicitContentFilter }, reason);
  }

  /* eslint-disable max-len */
  /**
   * Edits the setting of the default message notifications of the server.
   * @param {DefaultMessageNotifications|number} defaultMessageNotifications The new setting for the default message notifications
   * @param {string} [reason] Reason for changing the setting of the default message notifications
   * @returns {Promise<Server>}
   */
  setDefaultMessageNotifications(defaultMessageNotifications, reason) {
    return this.edit({ defaultMessageNotifications }, reason);
  }
  /* eslint-enable max-len */

  /**
   * Edits the flags of the default message notifications of the server.
   * @param {SystemChannelFlagsResolvable} systemChannelFlags The new flags for the default message notifications
   * @param {string} [reason] Reason for changing the flags of the default message notifications
   * @returns {Promise<Server>}
   */
  setSystemChannelFlags(systemChannelFlags, reason) {
    return this.edit({ systemChannelFlags }, reason);
  }

  /**
   * Edits the name of the server.
   * @param {string} name The new name of the server
   * @param {string} [reason] Reason for changing the server's name
   * @returns {Promise<Server>}
   * @example
   * // Edit the server name
   * server.setName('Discord Server')
   *  .then(updated => console.log(`Updated server name to ${updated.name}`))
   *  .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Edits the region of the server.
   * @param {string} region The new region of the server
   * @param {string} [reason] Reason for changing the server's region
   * @returns {Promise<Server>}
   * @example
   * // Edit the server region
   * server.setRegion('london')
   *  .then(updated => console.log(`Updated server region to ${updated.region}`))
   *  .catch(console.error);
   */
  setRegion(region, reason) {
    return this.edit({ region }, reason);
  }

  /**
   * Edits the verification level of the server.
   * @param {VerificationLevel|number} verificationLevel The new verification level of the server
   * @param {string} [reason] Reason for changing the server's verification level
   * @returns {Promise<Server>}
   * @example
   * // Edit the server verification level
   * server.setVerificationLevel(1)
   *  .then(updated => console.log(`Updated server verification level to ${server.verificationLevel}`))
   *  .catch(console.error);
   */
  setVerificationLevel(verificationLevel, reason) {
    return this.edit({ verificationLevel }, reason);
  }

  /**
   * Edits the AFK channel of the server.
   * @param {ChannelResolvable} afkChannel The new AFK channel
   * @param {string} [reason] Reason for changing the server's AFK channel
   * @returns {Promise<Server>}
   * @example
   * // Edit the server AFK channel
   * server.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated server AFK channel to ${server.afkChannel.name}`))
   *  .catch(console.error);
   */
  setAFKChannel(afkChannel, reason) {
    return this.edit({ afkChannel }, reason);
  }

  /**
   * Edits the system channel of the server.
   * @param {ChannelResolvable} systemChannel The new system channel
   * @param {string} [reason] Reason for changing the server's system channel
   * @returns {Promise<Server>}
   * @example
   * // Edit the server system channel
   * server.setSystemChannel(channel)
   *  .then(updated => console.log(`Updated server system channel to ${server.systemChannel.name}`))
   *  .catch(console.error);
   */
  setSystemChannel(systemChannel, reason) {
    return this.edit({ systemChannel }, reason);
  }

  /**
   * Edits the AFK timeout of the server.
   * @param {number} afkTimeout The time in seconds that a user must be idle to be considered AFK
   * @param {string} [reason] Reason for changing the server's AFK timeout
   * @returns {Promise<Server>}
   * @example
   * // Edit the server AFK channel
   * server.setAFKTimeout(60)
   *  .then(updated => console.log(`Updated server AFK timeout to ${server.afkTimeout}`))
   *  .catch(console.error);
   */
  setAFKTimeout(afkTimeout, reason) {
    return this.edit({ afkTimeout }, reason);
  }

  /**
   * Sets a new server icon.
   * @param {Base64Resolvable|BufferResolvable} icon The new icon of the server
   * @param {string} [reason] Reason for changing the server's icon
   * @returns {Promise<Server>}
   * @example
   * // Edit the server icon
   * server.setIcon('./icon.png')
   *  .then(updated => console.log('Updated the server icon'))
   *  .catch(console.error);
   */
  async setIcon(icon, reason) {
    return this.edit({ icon: await DataResolver.resolveImage(icon), reason });
  }

  /**
   * Sets a new owner of the server.
   * @param {ServerMemberResolvable} owner The new owner of the server
   * @param {string} [reason] Reason for setting the new owner
   * @returns {Promise<Server>}
   * @example
   * // Edit the server owner
   * server.setOwner(server.members.cache.first())
   *  .then(updated => console.log(`Updated the server owner to ${updated.owner.displayName}`))
   *  .catch(console.error);
   */
  setOwner(owner, reason) {
    return this.edit({ owner }, reason);
  }

  /**
   * Sets a new server invite splash image.
   * @param {Base64Resolvable|BufferResolvable} splash The new invite splash image of the server
   * @param {string} [reason] Reason for changing the server's invite splash image
   * @returns {Promise<Server>}
   * @example
   * // Edit the server splash
   * server.setSplash('./splash.png')
   *  .then(updated => console.log('Updated the server splash'))
   *  .catch(console.error);
   */
  async setSplash(splash, reason) {
    return this.edit({ splash: await DataResolver.resolveImage(splash), reason });
  }

  /**
   * Sets a new server discovery splash image.
   * @param {Base64Resolvable|BufferResolvable} discoverySplash The new discovery splash image of the server
   * @param {string} [reason] Reason for changing the server's discovery splash image
   * @returns {Promise<Server>}
   * @example
   * // Edit the server discovery splash
   * server.setDiscoverySplash('./discoverysplash.png')
   *   .then(updated => console.log('Updated the server discovery splash'))
   *   .catch(console.error);
   */
  async setDiscoverySplash(discoverySplash, reason) {
    return this.edit({ discoverySplash: await DataResolver.resolveImage(discoverySplash), reason });
  }

  /**
   * Sets a new server banner.
   * @param {Base64Resolvable|BufferResolvable} banner The new banner of the server
   * @param {string} [reason] Reason for changing the server's banner
   * @returns {Promise<Server>}
   * @example
   * server.setBanner('./banner.png')
   *  .then(updated => console.log('Updated the server banner'))
   *  .catch(console.error);
   */
  async setBanner(banner, reason) {
    return this.edit({ banner: await DataResolver.resolveImage(banner), reason });
  }

  /**
   * Edits the rules channel of the server.
   * @param {ChannelResolvable} rulesChannel The new rules channel
   * @param {string} [reason] Reason for changing the server's rules channel
   * @returns {Promise<Server>}
   * @example
   * // Edit the server rules channel
   * server.setRulesChannel(channel)
   *  .then(updated => console.log(`Updated server rules channel to ${server.rulesChannel.name}`))
   *  .catch(console.error);
   */
  setRulesChannel(rulesChannel, reason) {
    return this.edit({ rulesChannel }, reason);
  }

  /**
   * Edits the community updates channel of the server.
   * @param {ChannelResolvable} publicUpdatesChannel The new community updates channel
   * @param {string} [reason] Reason for changing the server's community updates channel
   * @returns {Promise<Server>}
   * @example
   * // Edit the server community updates channel
   * server.setPublicUpdatesChannel(channel)
   *  .then(updated => console.log(`Updated server community updates channel to ${server.publicUpdatesChannel.name}`))
   *  .catch(console.error);
   */
  setPublicUpdatesChannel(publicUpdatesChannel, reason) {
    return this.edit({ publicUpdatesChannel }, reason);
  }

  /**
   * Edits the preferred locale of the server.
   * @param {string} preferredLocale The new preferred locale of the server
   * @param {string} [reason] Reason for changing the server's preferred locale
   * @returns {Promise<Server>}
   * @example
   * // Edit the server preferred locale
   * server.setPreferredLocale('en-US')
   *  .then(updated => console.log(`Updated server preferred locale to ${server.preferredLocale}`))
   *  .catch(console.error);
   */
  setPreferredLocale(preferredLocale, reason) {
    return this.edit({ preferredLocale }, reason);
  }

  /**
   * The data needed for updating a channel's position.
   * @typedef {Object} ChannelPosition
   * @property {ChannelResolvable} channel Channel to update
   * @property {number} position New position for the channel
   */

  /**
   * Batch-updates the server's channels' positions.
   * @param {ChannelPosition[]} channelPositions Channel positions to update
   * @returns {Promise<Server>}
   * @example
   * server.setChannelPositions([{ channel: channelID, position: newChannelIndex }])
   *   .then(server => console.log(`Updated channel positions for ${server}`))
   *   .catch(console.error);
   */
  setChannelPositions(channelPositions) {
    const updatedChannels = channelPositions.map(r => ({
      id: this.client.channels.resolveID(r.channel),
      position: r.position,
    }));

    return this.client.api
      .servers(this.id)
      .channels.patch({ data: updatedChannels })
      .then(
        () =>
          this.client.actions.ServerChannelsPositionUpdate.handle({
            server_id: this.id,
            channels: updatedChannels,
          }).server,
      );
  }

  /**
   * The data needed for updating a server role's position
   * @typedef {Object} ServerRolePosition
   * @property {RoleResolveable} role The ID of the role
   * @property {number} position The position to update
   */

  /**
   * Batch-updates the server's role positions
   * @param {ServerRolePosition[]} rolePositions Role positions to update
   * @returns {Promise<Server>}
   * @example
   * server.setRolePositions([{ role: roleID, position: updatedRoleIndex }])
   *  .then(server => console.log(`Role permissions updated for ${server}`))
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
      .servers(this.id)
      .roles.patch({
        data: rolePositions,
      })
      .then(
        () =>
          this.client.actions.ServerRolesPositionUpdate.handle({
            server_id: this.id,
            roles: rolePositions,
          }).server,
      );
  }

  /**
   * Edits the server's embed.
   * @param {ServerWidgetData} embed The embed for the server
   * @param {string} [reason] Reason for changing the server's embed
   * @returns {Promise<Server>}
   * @deprecated
   */
  setEmbed(embed, reason) {
    return this.setWidget(embed, reason);
  }

  /**
   * Edits the server's widget.
   * @param {ServerWidgetData} widget The widget for the server
   * @param {string} [reason] Reason for changing the server's widget
   * @returns {Promise<Server>}
   */
  setWidget(widget, reason) {
    return this.client.api
      .servers(this.id)
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
   * Leaves the server.
   * @returns {Promise<Server>}
   * @example
   * // Leave a server
   * server.leave()
   *   .then(g => console.log(`Left the server ${g}`))
   *   .catch(console.error);
   */
  leave() {
    if (this.ownerID === this.client.user.id) return Promise.reject(new Error('GUILD_OWNED'));
    return this.client.api
      .users('@me')
      .servers(this.id)
      .delete()
      .then(() => this.client.actions.ServerDelete.handle({ id: this.id }).server);
  }

  /**
   * Deletes the server.
   * @returns {Promise<Server>}
   * @example
   * // Delete a server
   * server.delete()
   *   .then(g => console.log(`Deleted the server ${g}`))
   *   .catch(console.error);
   */
  delete() {
    return this.client.api
      .servers(this.id)
      .delete()
      .then(() => this.client.actions.ServerDelete.handle({ id: this.id }).server);
  }

  /**
   * Whether this server equals another server. It compares all properties, so for most operations
   * it is advisable to just compare `server.id === server2.id` as it is much faster and is often
   * what most users need.
   * @param {Server} server The server to compare with
   * @returns {boolean}
   */
  equals(server) {
    let equal =
      server &&
      server instanceof this.constructor &&
      this.id === server.id &&
      this.available === server.available &&
      this.splash === server.splash &&
      this.discoverySplash === server.discoverySplash &&
      this.region === server.region &&
      this.name === server.name &&
      this.memberCount === server.memberCount &&
      this.large === server.large &&
      this.icon === server.icon &&
      this.ownerID === server.ownerID &&
      this.verificationLevel === server.verificationLevel &&
      this.embedEnabled === server.embedEnabled &&
      (this.features === server.features ||
        (this.features.length === server.features.length &&
          this.features.every((feat, i) => feat === server.features[i])));

    if (equal) {
      if (this.embedChannel) {
        if (!server.embedChannel || this.embedChannel.id !== server.embedChannel.id) equal = false;
      } else if (server.embedChannel) {
        equal = false;
      }
    }

    return equal;
  }

  /**
   * When concatenated with a string, this automatically returns the server's name instead of the Server object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Server!
   * console.log(`Hello from ${server}!`);
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
   * Creates a collection of this server's roles, sorted by their position and IDs.
   * @returns {Collection<Role>}
   * @private
   */
  _sortedRoles() {
    return Util.discordSort(this.roles.cache);
  }

  /**
   * Creates a collection of this server's or a specific category's channels, sorted by their position and IDs.
   * @param {ServerChannel} [channel] Category to get the channels of
   * @returns {Collection<ServerChannel>}
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

Server.prototype.setEmbed = deprecate(Server.prototype.setEmbed, 'Server#setEmbed: Use setWidget instead');

Server.prototype.fetchEmbed = deprecate(Server.prototype.fetchEmbed, 'Server#fetchEmbed: Use fetchWidget instead');

Server.prototype.fetchVanityCode = deprecate(
  Server.prototype.fetchVanityCode,
  'Server#fetchVanityCode: Use fetchVanityData() instead',
);

module.exports = Server;
