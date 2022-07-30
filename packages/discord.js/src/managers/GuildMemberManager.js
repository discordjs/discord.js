'use strict';

const { Buffer } = require('node:buffer');
const { setTimeout, clearTimeout } = require('node:timers');
const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Routes, GatewayOpcodes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { Error, TypeError, RangeError, ErrorCodes } = require('../errors');
const BaseGuildVoiceChannel = require('../structures/BaseGuildVoiceChannel');
const { GuildMember } = require('../structures/GuildMember');
const { Role } = require('../structures/Role');
const Events = require('../util/Events');
const Partials = require('../util/Partials');

/**
 * Manages API methods for GuildMembers and stores their cache.
 * @extends {CachedManager}
 */
class GuildMemberManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, GuildMember, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, GuildMember>}
   * @name GuildMemberManager#cache
   */

  _add(data, cache = true) {
    return super._add(data, cache, { id: data.user.id, extras: [this.guild] });
  }

  /**
   * Data that resolves to give a GuildMember object. This can be:
   * * A GuildMember object
   * * A User resolvable
   * @typedef {GuildMember|UserResolvable} GuildMemberResolvable
   */

  /**
   * Resolves a {@link GuildMemberResolvable} to a {@link GuildMember} object.
   * @param {GuildMemberResolvable} member The user that is part of the guild
   * @returns {?GuildMember}
   */
  resolve(member) {
    const memberResolvable = super.resolve(member);
    if (memberResolvable) return memberResolvable;
    const userResolvable = this.client.users.resolveId(member);
    if (userResolvable) return super.resolve(userResolvable);
    return null;
  }

  /**
   * Resolves a {@link GuildMemberResolvable} to a member id.
   * @param {GuildMemberResolvable} member The user that is part of the guild
   * @returns {?Snowflake}
   */
  resolveId(member) {
    const memberResolvable = super.resolveId(member);
    if (memberResolvable) return memberResolvable;
    const userResolvable = this.client.users.resolveId(member);
    return this.cache.has(userResolvable) ? userResolvable : null;
  }

  /**
   * Options used to add a user to a guild using OAuth2.
   * @typedef {Object} AddGuildMemberOptions
   * @property {string} accessToken An OAuth2 access token for the user with the {@link OAuth2Scopes.GuildsJoin}
   * scope granted to the bot's application
   * @property {string} [nick] The nickname to give to the member
   * <info>This property requires the {@link PermissionFlagsBits.ManageNicknames} permission.</info>
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles to add to the member
   * <info>This property requires the {@link PermissionFlagsBits.ManageRoles} permission.</info>
   * @property {boolean} [mute] Whether the member should be muted
   * <info>This property requires the {@link PermissionFlagsBits.MuteMembers} permission.</info>
   * @property {boolean} [deaf] Whether the member should be deafened
   * <info>This property requires the {@link PermissionFlagsBits.MuteMembers} permission.</info>
   * @property {boolean} [force] Whether to skip the cache check and request the API directly
   * @property {boolean} [fetchWhenExisting=true] Whether to fetch the user if not cached and already a member
   */

  /**
   * Adds a user to the guild using OAuth2.
   * <info>This method requires the {@link PermissionFlagsBits.CreateInstantInvite} permission.
   * @param {UserResolvable} user The user to add to the guild
   * @param {AddGuildMemberOptions} options Options for adding the user to the guild
   * @returns {Promise<GuildMember|null>}
   */
  async add(user, options) {
    const userId = this.client.users.resolveId(user);
    if (!userId) throw new TypeError(ErrorCodes.InvalidType, 'user', 'UserResolvable');
    if (!options.force) {
      const cachedUser = this.cache.get(userId);
      if (cachedUser) return cachedUser;
    }
    const resolvedOptions = {
      access_token: options.accessToken,
      nick: options.nick,
      mute: options.mute,
      deaf: options.deaf,
    };
    if (options.roles) {
      if (!Array.isArray(options.roles) && !(options.roles instanceof Collection)) {
        throw new TypeError(
          ErrorCodes.InvalidType,
          'options.roles',
          'Array or Collection of Roles or Snowflakes',
          true,
        );
      }
      const resolvedRoles = [];
      for (const role of options.roles.values()) {
        const resolvedRole = this.guild.roles.resolveId(role);
        if (!resolvedRole) {
          throw new TypeError(ErrorCodes.InvalidElement, 'Array or Collection', 'options.roles', role);
        }
        resolvedRoles.push(resolvedRole);
      }
      resolvedOptions.roles = resolvedRoles;
    }
    const data = await this.client.rest.put(Routes.guildMember(this.guild.id, userId), { body: resolvedOptions });
    // Data is an empty buffer if the member is already part of the guild.
    return data instanceof Buffer ? (options.fetchWhenExisting === false ? null : this.fetch(userId)) : this._add(data);
  }

  /**
   * The client user as a GuildMember of this guild
   * @type {?GuildMember}
   * @readonly
   */
  get me() {
    return (
      this.resolve(this.client.user.id) ??
      (this.client.options.partials.includes(Partials.GuildMember)
        ? this._add({ user: { id: this.client.user.id } }, true)
        : null)
    );
  }

  /**
   * Options used to fetch a single member from a guild.
   * @typedef {BaseFetchOptions} FetchMemberOptions
   * @property {UserResolvable} user The user to fetch
   */

  /**
   * Options used to fetch multiple members from a guild.
   * @typedef {Object} FetchMembersOptions
   * @property {UserResolvable|UserResolvable[]} user The user(s) to fetch
   * @property {?string} query Limit fetch to members with similar usernames
   * @property {number} [limit=0] Maximum number of members to request
   * @property {boolean} [withPresences=false] Whether or not to include the presences
   * @property {number} [time=120e3] Timeout for receipt of members
   * @property {?string} nonce Nonce for this request (32 characters max - default to base 16 now timestamp)
   * @property {boolean} [force=false] Whether to skip the cache check and request the API
   */

  /**
   * Fetches member(s) from Discord, even if they're offline.
   * @param {UserResolvable|FetchMemberOptions|FetchMembersOptions} [options] If a UserResolvable, the user to fetch.
   * If undefined, fetches all members.
   * If a query, it limits the results to users with similar usernames.
   * @returns {Promise<GuildMember|Collection<Snowflake, GuildMember>>}
   * @example
   * // Fetch all members from a guild
   * guild.members.fetch()
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single member
   * guild.members.fetch('66564597481480192')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single member without checking cache
   * guild.members.fetch({ user, force: true })
   *   .then(console.log)
   *   .catch(console.error)
   * @example
   * // Fetch a single member without caching
   * guild.members.fetch({ user, cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch by an array of users including their presences
   * guild.members.fetch({ user: ['66564597481480192', '191615925336670208'], withPresences: true })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch by query
   * guild.members.fetch({ query: 'hydra', limit: 1 })
   *   .then(console.log)
   *   .catch(console.error);
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const user = this.client.users.resolveId(options);
    if (user) return this._fetchSingle({ user, cache: true });
    if (options.user) {
      if (Array.isArray(options.user)) {
        options.user = options.user.map(u => this.client.users.resolveId(u));
        return this._fetchMany(options);
      } else {
        options.user = this.client.users.resolveId(options.user);
      }
      if (!options.limit && !options.withPresences) return this._fetchSingle(options);
    }
    return this._fetchMany(options);
  }

  /**
   * Fetches the client user as a GuildMember of the guild.
   * @param {BaseFetchOptions} [options] The options for fetching the member
   * @returns {Promise<GuildMember>}
   */
  fetchMe(options) {
    return this.fetch({ ...options, user: this.client.user.id });
  }

  /**
   * Options used for searching guild members.
   * @typedef {Object} GuildSearchMembersOptions
   * @property {string} query Filter members whose username or nickname start with this query
   * @property {number} [limit] Maximum number of members to search
   * @property {boolean} [cache=true] Whether or not to cache the fetched member(s)
   */

  /**
   * Searches for members in the guild based on a query.
   * @param {GuildSearchMembersOptions} options Options for searching members
   * @returns {Promise<Collection<Snowflake, GuildMember>>}
   */
  async search({ query, limit, cache = true } = {}) {
    const data = await this.client.rest.get(Routes.guildMembersSearch(this.guild.id), {
      query: makeURLSearchParams({ query, limit }),
    });
    return data.reduce((col, member) => col.set(member.user.id, this._add(member, cache)), new Collection());
  }

  /**
   * Options used for listing guild members.
   * @typedef {Object} GuildListMembersOptions
   * @property {Snowflake} [after] Limit fetching members to those with an id greater than the supplied id
   * @property {number} [limit] Maximum number of members to list
   * @property {boolean} [cache=true] Whether or not to cache the fetched member(s)
   */

  /**
   * Lists up to 1000 members of the guild.
   * @param {GuildListMembersOptions} [options] Options for listing members
   * @returns {Promise<Collection<Snowflake, GuildMember>>}
   */
  async list({ after, limit, cache = true } = {}) {
    const query = makeURLSearchParams({ limit, after });
    const data = await this.client.rest.get(Routes.guildMembers(this.guild.id), { query });
    return data.reduce((col, member) => col.set(member.user.id, this._add(member, cache)), new Collection());
  }

  /**
   * The data for editing a guild member.
   * @typedef {Object} GuildMemberEditData
   * @property {?string} [nick] The nickname to set for the member
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles or role ids to apply
   * @property {boolean} [mute] Whether or not the member should be muted
   * @property {boolean} [deaf] Whether or not the member should be deafened
   * @property {GuildVoiceChannelResolvable|null} [channel] Channel to move the member to
   * (if they are connected to voice), or `null` if you want to disconnect them from voice
   * @property {DateResolvable|null} [communicationDisabledUntil] The date or timestamp
   * for the member's communication to be disabled until. Provide `null` to enable communication again.
   * @property {string} [reason] Reason for editing this user
   */

  /**
   * Edits a member of the guild.
   * <info>The user must be a member of the guild</info>
   * @param {UserResolvable} user The member to edit
   * @param {GuildMemberEditData} data The data to edit the member with
   * @returns {Promise<GuildMember>}
   */
  async edit(user, { reason, ...data }) {
    const id = this.client.users.resolveId(user);
    if (!id) throw new TypeError(ErrorCodes.InvalidType, 'user', 'UserResolvable');

    if (data.channel) {
      data.channel = this.guild.channels.resolve(data.channel);
      if (!(data.channel instanceof BaseGuildVoiceChannel)) {
        throw new Error(ErrorCodes.GuildVoiceChannelResolve);
      }
      data.channel_id = data.channel.id;
      data.channel = undefined;
    } else if (data.channel === null) {
      data.channel_id = null;
      data.channel = undefined;
    }
    data.roles &&= data.roles.map(role => (role instanceof Role ? role.id : role));

    if (typeof data.communicationDisabledUntil !== 'undefined') {
      data.communication_disabled_until =
        // eslint-disable-next-line eqeqeq
        data.communicationDisabledUntil != null
          ? new Date(data.communicationDisabledUntil).toISOString()
          : data.communicationDisabledUntil;
    }

    let endpoint;
    if (id === this.client.user.id) {
      const keys = Object.keys(data);
      if (keys.length === 1 && keys[0] === 'nick') endpoint = Routes.guildMember(this.guild.id);
      else endpoint = Routes.guildMember(this.guild.id, id);
    } else {
      endpoint = Routes.guildMember(this.guild.id, id);
    }
    const d = await this.client.rest.patch(endpoint, { body: data, reason });

    const clone = this.cache.get(id)?._clone();
    clone?._patch(d);
    return clone ?? this._add(d, false);
  }

  /**
   * Options used for pruning guild members.
   * <info>It's recommended to set {@link GuildPruneMembersOptions#count options.count}
   * to `false` for large guilds.</info>
   * @typedef {Object} GuildPruneMembersOptions
   * @property {number} [days] Number of days of inactivity required to kick
   * @property {boolean} [dry=false] Get the number of users that will be kicked, without actually kicking them
   * @property {boolean} [count] Whether or not to return the number of users that have been kicked.
   * @property {RoleResolvable[]} [roles] Array of roles to bypass the "...and no roles" constraint when pruning
   * @property {string} [reason] Reason for this prune
   */

  /**
   * Prunes members from the guild based on how long they have been inactive.
   * @param {GuildPruneMembersOptions} [options] Options for pruning
   * @returns {Promise<number|null>} The number of members that were/will be kicked
   * @example
   * // See how many members will be pruned
   * guild.members.prune({ dry: true })
   *   .then(pruned => console.log(`This will prune ${pruned} people!`))
   *   .catch(console.error);
   * @example
   * // Actually prune the members
   * guild.members.prune({ days: 1, reason: 'too many people!' })
   *   .then(pruned => console.log(`I just pruned ${pruned} people!`))
   *   .catch(console.error);
   * @example
   * // Include members with a specified role
   * guild.members.prune({ days: 7, roles: ['657259391652855808'] })
   *    .then(pruned => console.log(`I just pruned ${pruned} people!`))
   *    .catch(console.error);
   */
  async prune({ days, dry = false, count: compute_prune_count, roles = [], reason } = {}) {
    if (typeof days !== 'number') throw new TypeError(ErrorCodes.PruneDaysType);

    const query = { days };
    const resolvedRoles = [];

    for (const role of roles) {
      const resolvedRole = this.guild.roles.resolveId(role);
      if (!resolvedRole) {
        throw new TypeError(ErrorCodes.InvalidElement, 'Array', 'options.roles', role);
      }
      resolvedRoles.push(resolvedRole);
    }

    if (resolvedRoles.length) {
      query.include_roles = dry ? resolvedRoles.join(',') : resolvedRoles;
    }

    const endpoint = Routes.guildPrune(this.guild.id);

    const { pruned } = await (dry
      ? this.client.rest.get(endpoint, { query: makeURLSearchParams(query), reason })
      : this.client.rest.post(endpoint, { body: { ...query, compute_prune_count }, reason }));

    return pruned;
  }

  /**
   * Kicks a user from the guild.
   * <info>The user must be a member of the guild</info>
   * @param {UserResolvable} user The member to kick
   * @param {string} [reason] Reason for kicking
   * @returns {Promise<GuildMember|User|Snowflake>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user's id will be the result.
   * @example
   * // Kick a user by id (or with a user/guild member object)
   * guild.members.kick('84484653687267328')
   *   .then(kickInfo => console.log(`Kicked ${kickInfo.user?.tag ?? kickInfo.tag ?? kickInfo}`))
   *   .catch(console.error);
   */
  async kick(user, reason) {
    const id = this.client.users.resolveId(user);
    if (!id) return Promise.reject(new TypeError(ErrorCodes.InvalidType, 'user', 'UserResolvable'));

    await this.client.rest.delete(Routes.guildMember(this.guild.id, id), { reason });

    return this.resolve(user) ?? this.client.users.resolve(user) ?? id;
  }

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {BanOptions} [options] Options for the ban
   * @returns {Promise<GuildMember|User|Snowflake>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user id will be the result.
   * Internally calls the GuildBanManager#create method.
   * @example
   * // Ban a user by id (or with a user/guild member object)
   * guild.members.ban('84484653687267328')
   *   .then(banInfo => console.log(`Banned ${banInfo.user?.tag ?? banInfo.tag ?? banInfo}`))
   *   .catch(console.error);
   */
  ban(user, options) {
    return this.guild.bans.create(user, options);
  }

  /**
   * Unbans a user from the guild. Internally calls the {@link GuildBanManager#remove} method.
   * @param {UserResolvable} user The user to unban
   * @param {string} [reason] Reason for unbanning user
   * @returns {Promise<?User>} The user that was unbanned
   * @example
   * // Unban a user by id (or with a user/guild member object)
   * guild.members.unban('84484653687267328')
   *   .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *   .catch(console.error);
   */
  unban(user, reason) {
    return this.guild.bans.remove(user, reason);
  }

  /**
   * The options for {@link GuildMemberManager#addRole} and {@link GuildMemberManager#removeRole}.
   * @typedef RoleAddOptions
   * @property {RoleResolvable} role
   * @property {string} [reason]
   */

  /**
   * Adds a role to a member.
   * @param {User} user The member to add a role to
   * @param {RoleAddOptions} options Options for the role adding
   */
  async addRole(user, { role, reason }) {
    user = this.guild.members.resolveId(user);
    role = this.guild.roles.resolveId(role);
    await this.client.rest.put(Routes.guildMemberRole(this.guild.id, user, role), { reason })
  }

  /**
   * Removes a role from a member.
   * @param {User} user The member to remove a role from
   * @param {RoleAddOptions} options Options for the role removal
   */
   async removeRole(user, { role, reason }) {
    user = this.guild.members.resolveId(user);
    role = this.guild.roles.resolveId(role);
    await this.client.rest.delete(Routes.guildMemberRole(this.guild.id, user, role), { reason })
  }

  async _fetchSingle({ user, cache, force = false }) {
    if (!force) {
      const existing = this.cache.get(user);
      if (existing && !existing.partial) return existing;
    }

    const data = await this.client.rest.get(Routes.guildMember(this.guild.id, user));
    return this._add(data, cache);
  }

  _fetchMany({
    limit = 0,
    withPresences: presences = false,
    user: user_ids,
    query,
    time = 120e3,
    nonce = DiscordSnowflake.generate().toString(),
  } = {}) {
    return new Promise((resolve, reject) => {
      if (!query && !user_ids) query = '';
      if (nonce.length > 32) throw new RangeError(ErrorCodes.MemberFetchNonceLength);
      this.guild.shard.send({
        op: GatewayOpcodes.RequestGuildMembers,
        d: {
          guild_id: this.guild.id,
          presences,
          user_ids,
          query,
          nonce,
          limit,
        },
      });
      const fetchedMembers = new Collection();
      let i = 0;
      const handler = (members, _, chunk) => {
        timeout.refresh();
        if (chunk.nonce !== nonce) return;
        i++;
        for (const member of members.values()) {
          fetchedMembers.set(member.id, member);
        }
        if (members.size < 1_000 || (limit && fetchedMembers.size >= limit) || i === chunk.count) {
          clearTimeout(timeout);
          this.client.removeListener(Events.GuildMembersChunk, handler);
          this.client.decrementMaxListeners();
          let fetched = fetchedMembers;
          if (user_ids && !Array.isArray(user_ids) && fetched.size) fetched = fetched.first();
          resolve(fetched);
        }
      };
      const timeout = setTimeout(() => {
        this.client.removeListener(Events.GuildMembersChunk, handler);
        this.client.decrementMaxListeners();
        reject(new Error(ErrorCodes.GuildMembersTimeout));
      }, time).unref();
      this.client.incrementMaxListeners();
      this.client.on(Events.GuildMembersChunk, handler);
    });
  }
}

module.exports = GuildMemberManager;
