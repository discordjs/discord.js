const Long = require('long');
const Role = require('./Role');
const Invite = require('./Invite');
const GuildAuditLogs = require('./GuildAuditLogs');
const Webhook = require('./Webhook');
const GuildChannel = require('./GuildChannel');
const GuildMember = require('./GuildMember');
const VoiceRegion = require('./VoiceRegion');
const Constants = require('../util/Constants');
const Collection = require('../util/Collection');
const Util = require('../util/Util');
const Snowflake = require('../util/Snowflake');
const Permissions = require('../util/Permissions');
const Shared = require('./shared');
const GuildMemberStore = require('../stores/GuildMemberStore');
const RoleStore = require('../stores/RoleStore');
const EmojiStore = require('../stores/EmojiStore');
const GuildChannelStore = require('../stores/GuildChannelStore');
const PresenceStore = require('../stores/PresenceStore');
const Base = require('./Base');
const { Error, TypeError } = require('../errors');

/**
 * Represents a guild (or a server) on Discord.
 * <info>It's recommended to see if a guild is available before performing operations or reading data from it. You can
 * check this with `guild.available`.</info>
 * @extends {Base}
 */
class Guild extends Base {
  constructor(client, data) {
    super(client);

    /**
     * A collection of members that are in this guild. The key is the member's ID, the value is the member
     * @type {GuildMemberStore<Snowflake, GuildMember>}
     */
    this.members = new GuildMemberStore(this);

    /**
     * A collection of channels that are in this guild. The key is the channel's ID, the value is the channel
     * @type {GuildChannelStore<Snowflake, GuildChannel>}
     */
    this.channels = new GuildChannelStore(this);

    /**
     * A collection of roles that are in this guild. The key is the role's ID, the value is the role
     * @type {Collection<Snowflake, Role>}
     */
    this.roles = new RoleStore(this);

    /**
     * A collection of presences in this guild
     * @type {PresenceStore<Snowflake, Presence>}
     */
    this.presences = new PresenceStore(this.client);

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
     * The full amount of members in this guild as of `READY`
     * @type {number}
     */
    this.memberCount = data.member_count || this.memberCount;

    /**
     * Whether the guild is "large" (has more than 250 members)
     * @type {boolean}
     */
    this.large = Boolean('large' in data ? data.large : this.large);

    /**
     * An array of guild features
     * @type {Object[]}
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
     * The verification level of the guild
     * @type {number}
     */
    this.verificationLevel = data.verification_level;

    /**
     * The explicit content filter level of the guild
     * @type {number}
     */
    this.explicitContentFilter = data.explicit_content_filter;

    /**
     * The timestamp the client user joined the guild at
     * @type {number}
     */
    this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

    this.id = data.id;
    this.available = !data.unavailable;
    this.features = data.features || this.features || [];

    if (data.members) {
      this.members.clear();
      for (const guildUser of data.members) this.members.create(guildUser);
    }

    if (data.owner_id) {
      /**
       * The user ID of this guild's owner
       * @type {Snowflake}
       */
      this.ownerID = data.owner_id;
    }

    if (data.channels) {
      this.channels.clear();
      for (const rawChannel of data.channels) {
        this.client.channels.create(rawChannel, this);
      }
    }

    if (data.roles) {
      this.roles.clear();
      for (const role of data.roles) this.roles.create(role);
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this.presences.create(presence);
      }
    }

    this.voiceStates = new VoiceStateCollection(this);
    if (data.voice_states) {
      for (const voiceState of data.voice_states) this.voiceStates.set(voiceState.user_id, voiceState);
    }

    if (!this.emojis) {
      /**
       * A collection of emojis that are in this guild. The key is the emoji's ID, the value is the emoji.
       * @type {EmojiStore<Snowflake, Emoji>}
       */
      this.emojis = new EmojiStore(this);
      if (data.emojis) for (const emoji of data.emojis) this.emojis.create(emoji);
    } else {
      this.client.actions.GuildEmojisUpdate.handle({
        guild_id: this.id,
        emojis: data.emojis,
      });
    }
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
   * The time the guild was created
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
   * The URL to this guild's icon.
   * @param {Object} [options={}] Options for the icon url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
   * @param {number} [options.size=128] One of `128`, '256', `512`, `1024`, `2048`
   * @returns {?string}
   */
  iconURL({ format, size } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.Icon(this.id, this.icon, format, size);
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
   * @param {Object} [options={}] Options for the splash url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
   * @param {number} [options.size=128] One of `128`, '256', `512`, `1024`, `2048`
   * @returns {?string}
   */
  splashURL({ format, size } = {}) {
    if (!this.splash) return null;
    return this.client.rest.cdn.Splash(this.id, this.splash, format, size);
  }

  /**
   * The owner of the guild
   * @type {GuildMember}
   * @readonly
   */
  get owner() {
    return this.members.get(this.ownerID);
  }

  /**
   * AFK voice channel for this guild
   * @type {?VoiceChannel}
   * @readonly
   */
  get afkChannel() {
    return this.client.channels.get(this.afkChannelID) || null;
  }

  /**
   * System channel for this guild
   * @type {?GuildChannel}
   * @readonly
   */
  get systemChannel() {
    return this.client.channels.get(this.systemChannelID) || null;
  }

  /**
   * If the client is connected to any voice channel in this guild, this will be the relevant VoiceConnection
   * @type {?VoiceConnection}
   * @readonly
   */
  get voiceConnection() {
    if (this.client.browser) return null;
    return this.client.voice.connections.get(this.id) || null;
  }

  /**
   * The position of this guild
   * <warn>This is only available when using a user account.</warn>
   * @type {?number}
   * @readonly
   */
  get position() {
    if (this.client.user.bot) return null;
    if (!this.client.user.settings.guildPositions) return null;
    return this.client.user.settings.guildPositions.indexOf(this.id);
  }

  /**
   * Whether the guild is muted
   * <warn>This is only available when using a user account.</warn>
   * @type {?boolean}
   * @readonly
   */
  get muted() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.id).muted;
    } catch (err) {
      return false;
    }
  }

  /**
   * The type of message that should notify you
   * one of `EVERYTHING`, `MENTIONS`, `NOTHING`
   * <warn>This is only available when using a user account.</warn>
   * @type {?string}
   * @readonly
   */
  get messageNotifications() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.id).messageNotifications;
    } catch (err) {
      return null;
    }
  }

  /**
   * Whether to receive mobile push notifications
   * <warn>This is only available when using a user account.</warn>
   * @type {?boolean}
   * @readonly
   */
  get mobilePush() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.id).mobilePush;
    } catch (err) {
      return false;
    }
  }

  /**
   * Whether to suppress everyone messages
   * <warn>This is only available when using a user account.</warn>
   * @type {?boolean}
   * @readonly
   */
  get suppressEveryone() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.id).suppressEveryone;
    } catch (err) {
      return null;
    }
  }

  /*
   * The `@everyone` role of the guild
   * @type {Role}
   * @readonly
   */
  get defaultRole() {
    return this.roles.get(this.id);
  }

  /**
   * The client user as a GuildMember of this guild
   * @type {?GuildMember}
   * @readonly
   */
  get me() {
    return this.members.get(this.client.user.id);
  }

  /**
   * Fetches a collection of roles in the current guild sorted by position
   * @type {Collection<Snowflake, Role>}
   * @readonly
   * @private
   */
  get _sortedRoles() {
    return this._sortPositionWithID(this.roles);
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
    return this.client.resolver.resolveGuildMember(this, user);
  }

  /**
   * Fetch a collection of banned users in this guild.
   * The returned collection contains user objects keyed under `user` and reasons keyed under `reason`.
   * @returns {Promise<Collection<Snowflake, Object>>}
   */
  fetchBans() {
    return this.client.api.guilds(this.id).bans.get().then(bans =>
      bans.reduce((collection, ban) => {
        collection.set(ban.user.id, {
          reason: ban.reason,
          user: this.client.users.create(ban.user),
        });
        return collection;
      }, new Collection())
    );
  }

  /**
   * Fetch a collection of invites to this guild.
   * Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   */
  fetchInvites() {
    return this.client.api.guilds(this.id).invites.get()
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
   * Fetch all webhooks for the guild.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   */
  fetchWebhooks() {
    return this.client.api.guilds(this.id).webhooks.get().then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  /**
   * Fetch available voice regions.
   * @returns {Promise<Collection<string, VoiceRegion>>}
   */
  fetchVoiceRegions() {
    return this.client.api.guilds(this.id).regions.get().then(res => {
      const regions = new Collection();
      for (const region of res) regions.set(region.id, new VoiceRegion(region));
      return regions;
    });
  }

  /**
   * Fetch audit logs for this guild.
   * @param {Object} [options={}] Options for fetching audit logs
   * @param {Snowflake|GuildAuditLogsEntry} [options.before] Limit to entries from before specified entry
   * @param {Snowflake|GuildAuditLogsEntry} [options.after] Limit to entries from after specified entry
   * @param {number} [options.limit] Limit number of entries
   * @param {UserResolvable} [options.user] Only show entries involving this user
   * @param {string|number} [options.type] Only show entries involving this action type
   * @returns {Promise<GuildAuditLogs>}
   */
  fetchAuditLogs(options = {}) {
    if (options.before && options.before instanceof GuildAuditLogs.Entry) options.before = options.before.id;
    if (options.after && options.after instanceof GuildAuditLogs.Entry) options.after = options.after.id;
    if (typeof options.type === 'string') options.type = GuildAuditLogs.Actions[options.type];

    return this.client.api.guilds(this.id)['audit-logs'].get({ query: {
      before: options.before,
      after: options.after,
      limit: options.limit,
      user_id: this.client.resolver.resolveUserID(options.user),
      action_type: options.type,
    } })
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
    if (this.members.has(user.id)) return Promise.resolve(this.members.get(user.id));
    options.access_token = options.accessToken;
    if (options.roles) {
      const roles = [];
      for (let role of options.roles instanceof Collection ? options.roles.values() : options.roles) {
        role = this.client.resolver.resolveRole(this, role);
        if (!role) {
          return Promise.reject(new TypeError('INVALID_TYPE', 'options.roles',
            'Array or Collection of Roles or Snowflakes', true));
        }
        roles.push(role.id);
      }
    }
    return this.client.api.guilds(this.id).members(user.id).put({ data: options })
      .then(data => this.client.actions.GuildMemberGet.handle(this, data).member);
  }

  /**
   * Performs a search within the entire guild.
   * <warn>This is only available when using a user account.</warn>
   * @param {MessageSearchOptions} [options={}] Options to pass to the search
   * @returns {Promise<MessageSearchResult>}
   * @example
   * guild.search({
   *   content: 'discord.js',
   *   before: '2016-11-17'
   * }).then(res => {
   *   const hit = res.results[0].find(m => m.hit).content;
   *   console.log(`I found: **${hit}**, total results: ${res.total}`);
   * }).catch(console.error);
   */
  search(options = {}) {
    return Shared.search(this, options);
  }

  /**
   * The data for editing a guild.
   * @typedef {Object} GuildEditData
   * @property {string} [name] The name of the guild
   * @property {string} [region] The region of the guild
   * @property {number} [verificationLevel] The verification level of the guild
   * @property {number} [explicitContentFilter] The level of the explicit content filter
   * @property {ChannelResolvable} [afkChannel] The AFK channel of the guild
   * @property {ChannelResolvable} [systemChannel] The system channel of the guild
   * @property {number} [afkTimeout] The AFK timeout of the guild
   * @property {Base64Resolvable} [icon] The icon of the guild
   * @property {GuildMemberResolvable} [owner] The owner of the guild
   * @property {Base64Resolvable} [splash] The splash screen of the guild
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
   *   .then(updated => console.log(`New guild name ${updated.name} in region ${updated.region}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    const _data = {};
    if (data.name) _data.name = data.name;
    if (data.region) _data.region = data.region;
    if (typeof data.verificationLevel !== 'undefined') _data.verification_level = Number(data.verificationLevel);
    if (typeof data.afkChannel !== 'undefined') {
      _data.afk_channel_id = this.client.resolver.resolveChannelID(data.afkChannel);
    }
    if (typeof data.systemChannel !== 'undefined') {
      _data.system_channel_id = this.client.resolver.resolveChannelID(data.systemChannel);
    }
    if (data.afkTimeout) _data.afk_timeout = Number(data.afkTimeout);
    if (typeof data.icon !== 'undefined') _data.icon = data.icon;
    if (data.owner) _data.owner_id = this.client.resolver.resolveUser(data.owner).id;
    if (data.splash) _data.splash = data.splash;
    if (typeof data.explicitContentFilter !== 'undefined') {
      _data.explicit_content_filter = Number(data.explicitContentFilter);
    }
    return this.client.api.guilds(this.id).patch({ data: _data, reason })
      .then(newData => this.client.actions.GuildUpdate.handle(newData).updated);
  }

  /**
   * Edit the level of the explicit content filter.
   * @param {number} explicitContentFilter The new level of the explicit content filter
   * @param {string} [reason] Reason for changing the level of the guild's explicit content filter
   * @returns {Promise<Guild>}
   */
  setExplicitContentFilter(explicitContentFilter, reason) {
    return this.edit({ explicitContentFilter }, reason);
  }

  /**
   * Edit the name of the guild.
   * @param {string} name The new name of the guild
   * @param {string} [reason] Reason for changing the guild's name
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild name
   * guild.setName('Discord Guild')
   *  .then(updated => console.log(`Updated guild name to ${guild.name}`))
   *  .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Edit the region of the guild.
   * @param {string} region The new region of the guild
   * @param {string} [reason] Reason for changing the guild's region
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild region
   * guild.setRegion('london')
   *  .then(updated => console.log(`Updated guild region to ${guild.region}`))
   *  .catch(console.error);
   */
  setRegion(region, reason) {
    return this.edit({ region }, reason);
  }

  /**
   * Edit the verification level of the guild.
   * @param {number} verificationLevel The new verification level of the guild
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
   * Edit the AFK channel of the guild.
   * @param {ChannelResolvable} afkChannel The new AFK channel
   * @param {string} [reason] Reason for changing the guild's AFK channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated guild AFK channel to ${guild.afkChannel}`))
   *  .catch(console.error);
   */
  setAFKChannel(afkChannel, reason) {
    return this.edit({ afkChannel }, reason);
  }

  /**
   * Edit the system channel of the guild.
   * @param {ChannelResolvable} systemChannel The new system channel
   * @param {string} [reason] Reason for changing the guild's system channel
   * @returns {Promise<Guild>}
   */
  setSystemChannel(systemChannel, reason) {
    return this.edit({ systemChannel }, reason);
  }

  /**
   * Edit the AFK timeout of the guild.
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
   * Set a new guild icon.
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
    return this.edit({ icon: await this.client.resolver.resolveImage(icon), reason });
  }

  /**
   * Sets a new owner of the guild.
   * @param {GuildMemberResolvable} owner The new owner of the guild
   * @param {string} [reason] Reason for setting the new owner
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild owner
   * guild.setOwner(guild.members.first())
   *  .then(updated => console.log(`Updated the guild owner to ${updated.owner.username}`))
   *  .catch(console.error);
   */
  setOwner(owner, reason) {
    return this.edit({ owner }, reason);
  }

  /**
   * Set a new guild splash screen.
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
    return this.edit({ splash: await this.client.resolver.resolveImage(splash), reason });
  }

  /**
   * Sets the position of the guild in the guild listing.
   * <warn>This is only available when using a user account.</warn>
   * @param {number} position Absolute or relative position
   * @param {boolean} [relative=false] Whether to position relatively or absolutely
   * @returns {Promise<Guild>}
   */
  setPosition(position, relative) {
    if (this.client.user.bot) {
      return Promise.reject(new Error('FEATURE_USER_ONLY'));
    }
    return this.client.user.settings.setGuildPosition(this, position, relative);
  }

  /**
   * Marks all messages in this guild as read.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<Guild>}
   */
  acknowledge() {
    return this.client.api.guilds(this.id).ack
      .post({ data: { token: this.client.rest._ackToken } })
      .then(res => {
        if (res.token) this.client.rest._ackToken = res.token;
        return this;
      });
  }

  /**
   * Allow direct messages from guild members.
   * <warn>This is only available when using a user account.</warn>
   * @param {boolean} allow Whether to allow direct messages
   * @returns {Promise<Guild>}
   */
  allowDMs(allow) {
    const settings = this.client.user.settings;
    if (allow) return settings.removeRestrictedGuild(this);
    else return settings.addRestrictedGuild(this);
  }

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {Object|number|string} [options] Ban options. If a number, the number of days to delete messages for, if a
   * string, the ban reason. Supplying an object allows you to do both.
   * @param {number} [options.days=0] Number of days of messages to delete
   * @param {string} [options.reason] Reason for banning
   * @returns {Promise<GuildMember|User|string>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user ID will be the result.
   * @example
   * // Ban a user by ID (or with a user/guild member object)
   * guild.ban('some user ID')
   *   .then(user => console.log(`Banned ${user.username || user.id || user} from ${guild.name}`))
   *   .catch(console.error);
   */
  ban(user, options = { days: 0 }) {
    if (options.days) options['delete-message-days'] = options.days;
    const id = this.client.resolver.resolveUserID(user);
    if (!id) return Promise.reject(new Error('BAN_RESOLVE_ID', true));
    return this.client.api.guilds(this.id).bans[id].put({ query: options })
      .then(() => {
        if (user instanceof GuildMember) return user;
        const _user = this.client.resolver.resolveUser(id);
        if (_user) {
          const member = this.client.resolver.resolveGuildMember(this, _user);
          return member || _user;
        }
        return id;
      });
  }

  /**
   * Unbans a user from the guild.
   * @param {UserResolvable} user The user to unban
   * @param {string} [reason] Reason for unbanning user
   * @returns {Promise<User>}
   * @example
   * // Unban a user by ID (or with a user/guild member object)
   * guild.unban('some user ID')
   *   .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *   .catch(console.error);
   */
  unban(user, reason) {
    const id = this.client.resolver.resolveUserID(user);
    if (!id) throw new Error('BAN_RESOLVE_ID');
    return this.client.api.guilds(this.id).bans[id].delete({ reason })
      .then(() => user);
  }

  /**
   * Prunes members from the guild based on how long they have been inactive.
   * @param {Object} [options] Prune options
   * @param {number} [options.days=7] Number of days of inactivity required to kick
   * @param {boolean} [options.dry=false] Get number of users that will be kicked, without actually kicking them
   * @param {string} [options.reason] Reason for this prune
   * @returns {Promise<number>} The number of members that were/will be kicked
   * @example
   * // See how many members will be pruned
   * guild.pruneMembers({ dry: true })
   *   .then(pruned => console.log(`This will prune ${pruned} people!`))
   *   .catch(console.error);
   * @example
   * // Actually prune the members
   * guild.pruneMembers({ days: 1, reason: 'too many people!' })
   *   .then(pruned => console.log(`I just pruned ${pruned} people!`))
   *   .catch(console.error);
   */
  pruneMembers({ days = 7, dry = false, reason } = {}) {
    if (typeof days !== 'number') throw new TypeError('PRUNE_DAYS_TYPE');
    return this.client.api.guilds(this.id).prune[dry ? 'get' : 'post']({ query: { days }, reason })
      .then(data => data.pruned);
  }

  /**
   * Syncs this guild (already done automatically every 30 seconds).
   * <warn>This is only available when using a user account.</warn>
   */
  sync() {
    if (!this.client.user.bot) this.client.syncGuilds([this]);
  }

  /**
   * Can be used to overwrite permissions when creating a channel.
   * @typedef {Object} ChannelCreationOverwrites
   * @property {PermissionResolvable[]|number} [allow] The permissions to allow
   * @property {PermissionResolvable[]|number} [deny] The permissions to deny
   * @property {RoleResolvable|UserResolvable} id ID of the role or member this overwrite is for
   */

  /**
   * Creates a new channel in the guild.
   * @param {string} name The name of the new channel
   * @param {string} type The type of the new channel, either `text` or `voice`
   * @param {Object} [options={}] Options
   * @param {Array<PermissionOverwrites|ChannelCreationOverwrites>} [options.overwrites] Permission overwrites
   * to apply to the new channel
   * @param {string} [options.reason] Reason for creating this channel
   * @returns {Promise<TextChannel|VoiceChannel>}
   * @example
   * // Create a new text channel
   * guild.createChannel('new-general', 'text')
   *   .then(channel => console.log(`Created new channel ${channel}`))
   *   .catch(console.error);
   */
  createChannel(name, type, { overwrites, reason } = {}) {
    if (overwrites instanceof Collection || overwrites instanceof Array) {
      overwrites = overwrites.map(overwrite => {
        let allow = overwrite.allow || overwrite._allowed;
        let deny = overwrite.deny || overwrite._denied;
        if (allow instanceof Array) allow = Permissions.resolve(allow);
        if (deny instanceof Array) deny = Permissions.resolve(deny);

        const role = this.client.resolver.resolveRole(this, overwrite.id);
        if (role) {
          overwrite.id = role.id;
          overwrite.type = 'role';
        } else {
          overwrite.id = this.client.resolver.resolveUserID(overwrite.id);
          overwrite.type = 'member';
        }

        return {
          allow,
          deny,
          type: overwrite.type,
          id: overwrite.id,
        };
      });
    }

    return this.client.api.guilds(this.id).channels.post({
      data: {
        name,
        type: Constants.ChannelTypes[type.toUpperCase()],
        permission_overwrites: overwrites,
      },
      reason,
    }).then(data => this.client.actions.ChannelCreate.handle(data).channel);
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
   * guild.updateChannels([{ channel: channelID, position: newChannelIndex }])
   *   .then(guild => console.log(`Updated channel positions for ${guild.id}`))
   *   .catch(console.error);
   */
  setChannelPositions(channelPositions) {
    const data = new Array(channelPositions.length);
    for (let i = 0; i < channelPositions.length; i++) {
      data[i] = {
        id: this.client.resolver.resolveChannelID(channelPositions[i].channel),
        position: channelPositions[i].position,
      };
    }

    return this.client.api.guilds(this.id).channels.patch({ data: {
      guild_id: this.id,
      channels: channelPositions,
    } }).then(() =>
      this.client.actions.GuildChannelsPositionUpdate.handle({
        guild_id: this.id,
        channels: channelPositions,
      }).guild
    );
  }

  /**
   * Creates a new role in the guild with given information
   * <warn>The position will silently reset to 1 if an invalid one is provided, or none.</warn>
   * @param {Object} [options] Options
   * @param {RoleData} [options.data] The data to update the role with
   * @param {string} [options.reason] Reason for creating this role
   * @returns {Promise<Role>}
   * @example
   * // Create a new role
   * guild.createRole()
   *   .then(role => console.log(`Created role ${role}`))
   *   .catch(console.error);
   * @example
   * // Create a new role with data and a reason
   * guild.createRole({
   *   data: {
   *     name: 'Super Cool People',
   *     color: 'BLUE',
   *   },
   *   reason: 'we needed a role for Super Cool People',
   * })
   *   .then(role => console.log(`Created role ${role}`))
   *   .catch(console.error)
   */
  createRole({ data = {}, reason } = {}) {
    if (data.color) data.color = Util.resolveColor(data.color);
    if (data.permissions) data.permissions = Permissions.resolve(data.permissions);

    return this.client.api.guilds(this.id).roles.post({ data, reason }).then(r => {
      const { role } = this.client.actions.GuildRoleCreate.handle({
        guild_id: this.id,
        role: r,
      });
      if (data.position) return role.setPosition(data.position, reason);
      return role;
    });
  }

  /**
   * Creates a new custom emoji in the guild.
   * @param {BufferResolvable|Base64Resolvable} attachment The image for the emoji
   * @param {string} name The name for the emoji
   * @param {Object} [options] Options
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} [options.roles] Roles to limit the emoji to
   * @param {string} [options.reason] Reason for creating the emoji
   * @returns {Promise<Emoji>} The created emoji
   * @example
   * // Create a new emoji from a url
   * guild.createEmoji('https://i.imgur.com/w3duR07.png', 'rip')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   * @example
   * // Create a new emoji from a file on your computer
   * guild.createEmoji('./memes/banana.png', 'banana')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   */
  createEmoji(attachment, name, { roles, reason } = {}) {
    if (typeof attachment === 'string' && attachment.startsWith('data:')) {
      const data = { image: attachment, name };
      if (roles) {
        data.roles = [];
        for (let role of roles instanceof Collection ? roles.values() : roles) {
          role = this.client.resolver.resolveRole(this, role);
          if (!role) {
            return Promise.reject(new TypeError('INVALID_TYPE', 'options.roles',
              'Array or Collection of Roles or Snowflakes', true));
          }
          data.roles.push(role.id);
        }
      }

      return this.client.api.guilds(this.id).emojis.post({ data, reason })
        .then(emoji => this.client.actions.GuildEmojiCreate.handle(this, emoji).emoji);
    }

    return this.client.resolver.resolveImage(attachment)
      .then(image => this.createEmoji(image, name, { roles, reason }));
  }

  /**
   * Causes the client to leave the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Leave a guild
   * guild.leave()
   *   .then(g => console.log(`Left the guild ${g}`))
   *   .catch(console.error);
   */
  leave() {
    if (this.ownerID === this.client.user.id) return Promise.reject(new Error('GUILD_OWNED'));
    return this.client.api.users('@me').guilds(this.id).delete()
      .then(() => this.client.actions.GuildDelete.handle({ id: this.id }).guild);
  }

  /**
   * Causes the client to delete the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Delete a guild
   * guild.delete()
   *   .then(g => console.log(`Deleted the guild ${g}`))
   *   .catch(console.error);
   */
  delete() {
    return this.client.api.guilds(this.id).delete()
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
      Util.arraysEqual(this.features, guild.features) &&
      this.ownerID === guild.ownerID &&
      this.verificationLevel === guild.verificationLevel &&
      this.embedEnabled === guild.embedEnabled;

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
   * When concatenated with a string, this automatically concatenates the guild's name instead of the guild object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Guild!
   * console.log(`Hello from ${guild}!`);
   * @example
   * // Logs: Hello from My Guild!
   * console.log('Hello from ' + guild + '!');
   */
  toString() {
    return this.name;
  }

  _memberSpeakUpdate(user, speaking) {
    const member = this.members.get(user);
    if (member && member.speaking !== speaking) {
      member.speaking = speaking;
      /**
       * Emitted once a guild member starts/stops speaking.
       * @event Client#guildMemberSpeaking
       * @param {GuildMember} member The member that started/stopped speaking
       * @param {boolean} speaking Whether or not the member is speaking
       */
      this.client.emit(Constants.Events.GUILD_MEMBER_SPEAKING, member, speaking);
    }
  }

  /**
   * Set the position of a role in this guild.
   * @param {RoleResolvable} role The role to edit, can be a role object or a role ID
   * @param {number} position The new position of the role
   * @param {boolean} [relative=false] Position Moves the role relative to its current position
   * @returns {Promise<Guild>}
   */
  setRolePosition(role, position, relative = false) {
    if (typeof role === 'string') {
      role = this.roles.get(role);
    }
    if (!(role instanceof Role)) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));

    position = Number(position);
    if (isNaN(position)) return Promise.reject(new TypeError('INVALID_TYPE', 'position', 'number'));

    let updatedRoles = this._sortedRoles.array();

    Util.moveElementInArray(updatedRoles, role, position, relative);

    updatedRoles = updatedRoles.map((r, i) => ({ id: r.id, position: i }));
    return this.client.api.guilds(this.id).roles.patch({ data: updatedRoles })
      .then(() =>
        this.client.actions.GuildRolesPositionUpdate.handle({
          guild_id: this.id,
          roles: updatedRoles,
        }).guild
      );
  }

  /**
   * Set the position of a channel in this guild.
   * @param {ChannelResolvable} channel The channel to edit, can be a channel object or a channel ID
   * @param {number} position The new position of the channel
   * @param {boolean} [relative=false] Position Moves the channel relative to its current position
   * @returns {Promise<Guild>}
   */
  setChannelPosition(channel, position, relative = false) {
    if (typeof channel === 'string') {
      channel = this.channels.get(channel);
    }
    if (!(channel instanceof GuildChannel)) {
      return Promise.reject(new TypeError('INVALID_TYPE', 'channel', 'GuildChannel nor a Snowflake'));
    }

    position = Number(position);
    if (isNaN(position)) return Promise.reject(new TypeError('INVALID_TYPE', 'position', 'number'));

    let updatedChannels = this._sortedChannels(channel.type).array();

    Util.moveElementInArray(updatedChannels, channel, position, relative);

    updatedChannels = updatedChannels.map((r, i) => ({ id: r.id, position: i }));
    return this.client.api.guilds(this.id).channels.patch({ data: updatedChannels })
      .then(() =>
        this.client.actions.GuildChannelsPositionUpdate.handle({
          guild_id: this.id,
          channels: updatedChannels,
        }).guild
      );
  }

  /**
   * Fetches a collection of channels in the current guild sorted by position.
   * @param {string} type The channel type
   * @returns {Collection<Snowflake, GuildChannel>}
   * @private
   */
  _sortedChannels(type) {
    return this._sortPositionWithID(this.channels.filter(c => {
      if (type === 'voice' && c.type === 'voice') return true;
      else if (type !== 'voice' && c.type !== 'voice') return true;
      else return type === c.type;
    }));
  }

  /**
   * Sorts a collection by object position or ID if the positions are equivalent.
   * Intended to be identical to Discord's sorting method.
   * @param {Collection} collection The collection to sort
   * @returns {Collection}
   * @private
   */
  _sortPositionWithID(collection) {
    return collection.sort((a, b) =>
      a.position !== b.position ?
        a.position - b.position :
        Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber()
    );
  }
}

class VoiceStateCollection extends Collection {
  constructor(guild) {
    super();
    this.guild = guild;
  }
  set(id, voiceState) {
    const member = this.guild.members.get(id);
    if (member) {
      if (member.voiceChannel && member.voiceChannel.id !== voiceState.channel_id) {
        member.voiceChannel.members.delete(member.id);
      }
      if (!voiceState.channel_id) member.speaking = null;
      const newChannel = this.guild.channels.get(voiceState.channel_id);
      if (newChannel) newChannel.members.set(member.user.id, member);
    }
    super.set(id, voiceState);
  }
}

module.exports = Guild;
