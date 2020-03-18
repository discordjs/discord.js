'use strict';

const Base = require('./Base');
const GuildAuditLogs = require('./GuildAuditLogs');
const Integration = require('./Integration');
const Invite = require('./Invite');
const VoiceRegion = require('./VoiceRegion');
const Webhook = require('./Webhook');
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
} = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const Snowflake = require('../util/Snowflake');
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
     * The hash of the guild splash image (VIP only)
     * @type {?string}
     */
    this.splash = data.splash;

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

    /**
     * Whether the guild is "large" (has more than 250 members)
     * @type {boolean}
     */
    this.large = Boolean('large' in data ? data.large : this.large);

    /**
     * An array of enabled guild features, here are the possible values:
     * * ANIMATED_ICON
     * * BANNER
     * * COMMERCE
     * * DISCOVERABLE
     * * FEATURABLE
     * * INVITE_SPLASH
     * * PUBLIC
     * * NEWS
     * * PARTNERED
     * * VANITY_URL
     * * VERIFIED
     * * VIP_REGIONS
     * @typedef {string} Features
     */

    /**
     * An array of guild features partnered guilds have enabled
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
     * Whether embedded images are enabled on this guild
     * @type {boolean}
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
     * The premium tier on this guild
     * @type {PremiumTier}
     */
    this.premiumTier = data.premium_tier;

    /**
     * The total number of users currently boosting this server
     * @type {?number}
     * @name Guild#premiumSubscriptionCount
     */
    if (typeof data.premium_subscription_count !== 'undefined') {
      this.premiumSubscriptionCount = data.premium_subscription_count;
    }

    /**
     * Whether widget images are enabled on this guild
     * @type {?boolean}
     * @name Guild#widgetEnabled
     */
    if (typeof data.widget_enabled !== 'undefined') this.widgetEnabled = data.widget_enabled;

    /**
     * The widget channel ID, if enabled
     * @type {?string}
     * @name Guild#widgetChannelID
     */
    if (typeof data.widget_channel_id !== 'undefined') this.widgetChannelID = data.widget_channel_id;

    /**
     * The embed channel ID, if enabled
     * @type {?string}
     * @name Guild#embedChannelID
     */
    if (typeof data.embed_channel_id !== 'undefined') this.embedChannelID = data.embed_channel_id;

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

    /**
     * The maximum amount of members the guild can have
     * <info>You will need to fetch the guild using {@link Guild#fetch} if you want to receive this parameter</info>
     * @type {?number}
     * @name Guild#maximumMembers
     */
    if (typeof data.max_members !== 'undefined') this.maximumMembers = data.max_members || 250000;

    /**
     * The maximum amount of presences the guild can have
     * <info>You will need to fetch the guild using {@link Guild#fetch} if you want to receive this parameter</info>
     * @type {?number}
     * @name Guild#maximumPresences
     */
    if (typeof data.max_presences !== 'undefined') this.maximumPresences = data.max_presences || 5000;

    /**
     * The vanity URL code of the guild, if any
     * @type {?string}
     */
    this.vanityURLCode = data.vanity_url_code;

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
     * <info>This is only available on guilds with the `PUBLIC` feature</info>
     * @type {?Snowflake}
     */
    this.rulesChannelID = data.rules_channel_id;

    /**
     * The ID of the public updates channel for the guild
     * <info>This is only available on guilds with the `PUBLIC` feature</info>
     * @type {?Snowflake}
     */
    this.publicUpdatesChannelID = data.public_updates_channel_id;

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
    return Snowflake.deconstruct(this.id).timestamp;
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
    return this.name.replace(/\w+/g, name => name[0]).replace(/\s/g, '');
  }

  /**
   * The URL to this guild's splash.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  splashURL({ format, size } = {}) {
    if (!this.splash) return null;
    return this.client.rest.cdn.Splash(this.id, this.splash, format, size);
  }

  /**
   * The owner of the guild
   * @type {?GuildMember}
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
   * Embed channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get embedChannel() {
    return this.client.channels.cache.get(this.embedChannelID) || null;
  }

  /**
   * Rules channel for this guild
   * <info>This is only available on guilds with the `PUBLIC` feature</info>
   * @type {?TextChannel}
   * @readonly
   */
  get rulesChannel() {
    return this.client.channels.cache.get(this.rulesChannelID) || null;
  }

  /**
   * Public updates channel for this guild
   * <info>This is only available on guilds with the `PUBLIC` feature</info>
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
   * The voice state for the client user of this guild, if any
   * @type {?VoiceState}
   * @readonly
   */
  get voice() {
    return this.voiceStates.cache.get(this.client.user.id);
  }

  /**
   * Returns the GuildMember form of a User object, if the user is present in the guild.
   * @param {UserResolvable} user The user that you want to obtain the GuildMember of
   * @returns {?GuildMember}
   * @example
   * // Get the guild member of a user
   * const member = guild.member(message.author);
   */
  member(user) {
    return this.members.resolve(user);
  }

  /**
   * Fetches this guild.
   * @returns {Promise<Guild>}
   */
  fetch() {
    return this.client.api
      .guilds(this.id)
      .get()
      .then(data => {
        this._patch(data);
        return this;
      });
  }

  /**
   * An object containing information about a guild member's ban.
   * @typedef {Object} BanInfo
   * @property {User} user User that was banned
   * @property {?string} reason Reason the user was banned
   */

  /**
   * Fetches information on a banned user from this guild.
   * @param {UserResolvable} user The User to fetch the ban info of
   * @returns {Promise<BanInfo>}
   */
  fetchBan(user) {
    const id = this.client.users.resolveID(user);
    if (!id) throw new Error('FETCH_BAN_RESOLVE_ID');
    return this.client.api
      .guilds(this.id)
      .bans(id)
      .get()
      .then(ban => ({
        reason: ban.reason,
        user: this.client.users.add(ban.user),
      }));
  }

  /**
   * Fetches a collection of banned users in this guild.
   * @returns {Promise<Collection<Snowflake, BanInfo>>}
   */
  fetchBans() {
    return this.client.api
      .guilds(this.id)
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
   * Fetches a collection of integrations to this guild.
   * Resolves with a collection mapping integrations by their ids.
   * @returns {Promise<Collection<string, Integration>>}
   * @example
   * // Fetch integrations
   * guild.fetchIntegrations()
   *   .then(integrations => console.log(`Fetched ${integrations.size} integrations`))
   *   .catch(console.error);
   */
  fetchIntegrations() {
    return this.client.api
      .guilds(this.id)
      .integrations.get()
      .then(data =>
        data.reduce(
          (collection, integration) => collection.set(integration.id, new Integration(this.client, integration, this)),
          new Collection(),
        ),
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
   * Fetches the vanity url invite code to this guild.
   * Resolves with a string matching the vanity url invite code, not the full url.
   * @returns {Promise<string>}
   * @example
   * // Fetch invites
   * guild.fetchVanityCode()
   *   .then(code => {
   *     console.log(`Vanity URL: https://discord.gg/${code}`);
   *   })
   *   .catch(console.error);
   */
  fetchVanityCode() {
    if (!this.features.includes('VANITY_URL')) {
      return Promise.reject(new Error('VANITY_URL'));
    }
    return this.client.api
      .guilds(this.id, 'vanity-url')
      .get()
      .then(res => res.code);
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
   * The Guild Embed object
   * @typedef {Object} GuildEmbedData
   * @property {boolean} enabled Whether the embed is enabled
   * @property {?GuildChannel} channel The embed channel
   */

  /**
   * Fetches the guild embed.
   * @returns {Promise<GuildEmbedData>}
   * @example
   * // Fetches the guild embed
   * guild.fetchEmbed()
   *   .then(embed => console.log(`The embed is ${embed.enabled ? 'enabled' : 'disabled'}`))
   *   .catch(console.error);
   */
  fetchEmbed() {
    return this.client.api
      .guilds(this.id)
      .embed.get()
      .then(data => ({
        enabled: data.enabled,
        channel: data.channel_id ? this.channels.cache.get(data.channel_id) : null,
      }));
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
  addMember(user, options) {
    user = this.client.users.resolveID(user);
    if (!user) return Promise.reject(new TypeError('INVALID_TYPE', 'user', 'UserResolvable'));
    if (this.members.cache.has(user)) return Promise.resolve(this.members.cache.get(user));
    options.access_token = options.accessToken;
    if (options.roles) {
      const roles = [];
      for (let role of options.roles instanceof Collection ? options.roles.values() : options.roles) {
        role = this.roles.resolve(role);
        if (!role) {
          return Promise.reject(
            new TypeError('INVALID_TYPE', 'options.roles', 'Array or Collection of Roles or Snowflakes', true),
          );
        }
        roles.push(role.id);
      }
      options.roles = roles;
    }
    return this.client.api
      .guilds(this.id)
      .members(user)
      .put({ data: options })
      .then(data => this.members.add(data));
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
   * @property {Base64Resolvable} [splash] The splash screen of the guild
   * @property {Base64Resolvable} [banner] The banner of the guild
   * @property {DefaultMessageNotifications|number} [defaultMessageNotifications] The default message notifications
   * @property {SystemChannelFlagsResolvable} [systemChannelFlags] The system channel flags of the guild
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
   *  .then(updated => console.log(`Updated guild name to ${guild}`))
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
    return this.edit({ icon: await DataResolver.resolveImage(icon), reason });
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
   * Sets a new guild splash screen.
   * @param {Base64Resolvable|BufferResolvable} splash The new splash screen of the guild
   * @param {string} [reason] Reason for changing the guild's splash screen
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild splash
   * guild.setSplash('./splash.png')
   *  .then(updated => console.log('Updated the guild splash'))
   *  .catch(console.error);
   */
  async setSplash(splash, reason) {
    return this.edit({ splash: await DataResolver.resolveImage(splash), reason });
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
    return this.edit({ banner: await DataResolver.resolveImage(banner), reason });
  }

  /**
   * The data needed for updating a channel's position.
   * @typedef {Object} ChannelPosition
   * @property {ChannelResolvable} channel Channel to update
   * @property {number} position New position for the channel
   */

  /**
   * Batch-updates the guild's channels' positions.
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
   *  .then(guild => console.log(`Role permissions updated for ${guild}`))
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
   * Edits the guild's embed.
   * @param {GuildEmbedData} embed The embed for the guild
   * @param {string} [reason] Reason for changing the guild's embed
   * @returns {Promise<Guild>}
   */
  setEmbed(embed, reason) {
    return this.client.api
      .guilds(this.id)
      .embed.patch({
        data: {
          enabled: embed.enabled,
          channel_id: this.channels.resolveID(embed.channel),
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
    let equal =
      guild &&
      guild instanceof this.constructor &&
      this.id === guild.id &&
      this.available === guild.available &&
      this.splash === guild.splash &&
      this.region === guild.region &&
      this.name === guild.name &&
      this.memberCount === guild.memberCount &&
      this.large === guild.large &&
      this.icon === guild.icon &&
      this.ownerID === guild.ownerID &&
      this.verificationLevel === guild.verificationLevel &&
      this.embedEnabled === guild.embedEnabled &&
      (this.features === guild.features ||
        (this.features.length === guild.features.length &&
          this.features.every((feat, i) => feat === guild.features[i])));

    if (equal) {
      if (this.embedChannel) {
        if (!guild.embedChannel || this.embedChannel.id !== guild.embedChannel.id) equal = false;
      } else if (guild.embedChannel) {
        equal = false;
      }
    }

    return equal;
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
    json.bannerURL = this.bannerURL();
    return json;
  }

  /**
   * Creates a collection of this guild's roles, sorted by their position and IDs.
   * @returns {Collection<Role>}
   * @private
   */
  _sortedRoles() {
    return Util.discordSort(this.roles.cache);
  }

  /**
   * Creates a collection of this guild's or a specific category's channels, sorted by their position and IDs.
   * @param {GuildChannel} [channel] Category to get the channels of
   * @returns {Collection<GuildChannel>}
   * @private
   */
  _sortedChannels(channel) {
    const category = channel.type === ChannelTypes.CATEGORY;
    return Util.discordSort(
      this.channels.cache.filter(c => c.type === channel.type && (category || c.parent === channel.parent)),
    );
  }
}

module.exports = Guild;
