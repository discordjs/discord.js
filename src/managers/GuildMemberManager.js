'use strict';

const CachedManager = require('./CachedManager');
const { Error, TypeError, RangeError } = require('../errors');
const BaseGuildVoiceChannel = require('../structures/BaseGuildVoiceChannel');
const GuildMember = require('../structures/GuildMember');
const Role = require('../structures/Role');
const Collection = require('../util/Collection');
const { Events, Opcodes } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

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
   * @returns {Promise<GuildMember>|Promise<Collection<Snowflake, GuildMember>>}
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
   * Options used for searching guild members.
   * @typedef {Object} GuildSearchMembersOptions
   * @property {string} query Filter members whose username or nickname start with this query
   * @property {number} [limit=1] Maximum number of members to search
   * @property {boolean} [cache=true] Whether or not to cache the fetched member(s)
   */

  /**
   * Searches for members in the guild based on a query.
   * @param {GuildSearchMembersOptions} options Options for searching members
   * @returns {Promise<Collection<Snowflake, GuildMember>>}
   */
  async search({ query, limit = 1, cache = true } = {}) {
    const data = await this.client.api.guilds(this.guild.id).members.search.get({ query: { query, limit } });
    return data.reduce((col, member) => col.set(member.user.id, this._add(member, cache)), new Collection());
  }

  /**
   * Edits a member of the guild.
   * <info>The user must be a member of the guild</info>
   * @param {UserResolvable} user The member to edit
   * @param {GuildMemberEditData} data The data to edit the member with
   * @param {string} [reason] Reason for editing this user
   * @returns {Promise<GuildMember>}
   */
  async edit(user, data, reason) {
    const id = this.client.users.resolveId(user);
    if (!id) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable');

    // Clone the data object for immutability
    const _data = { ...data };
    if (_data.channel) {
      _data.channel = this.guild.channels.resolve(_data.channel);
      if (!(_data.channel instanceof BaseGuildVoiceChannel)) {
        throw new Error('GUILD_VOICE_CHANNEL_RESOLVE');
      }
      _data.channel_id = _data.channel.id;
      _data.channel = undefined;
    } else if (_data.channel === null) {
      _data.channel_id = null;
      _data.channel = undefined;
    }
    if (_data.roles) _data.roles = _data.roles.map(role => (role instanceof Role ? role.id : role));
    let endpoint = this.client.api.guilds(this.guild.id);
    if (id === this.client.user.id) {
      const keys = Object.keys(_data);
      if (keys.length === 1 && keys[0] === 'nick') endpoint = endpoint.members('@me').nick;
      else endpoint = endpoint.members(id);
    } else {
      endpoint = endpoint.members(id);
    }
    const d = await endpoint.patch({ data: _data, reason });

    const clone = this.cache.get(id)?._clone();
    clone?._patch(d);
    return clone ?? this._add(d, false);
  }

  /**
   * Options used for pruning guild members.
   * @typedef {Object} GuildPruneMembersOptions
   * @property {number} [days=7] Number of days of inactivity required to kick
   * @property {boolean} [dry=false] Get the number of users that will be kicked, without actually kicking them
   * @property {boolean} [count=true] Whether or not to return the number of users that have been kicked.
   * @property {RoleResolvable[]} [roles] Array of roles to bypass the "...and no roles" constraint when pruning
   * @property {string} [reason] Reason for this prune
   */

  /**
   * Prunes members from the guild based on how long they have been inactive.
   * <info>It's recommended to set `options.count` to `false` for large guilds.</info>
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
  prune({ days = 7, dry = false, count: compute_prune_count = true, roles = [], reason } = {}) {
    if (typeof days !== 'number') return Promise.reject(new TypeError('PRUNE_DAYS_TYPE'));

    const query = { days };
    const resolvedRoles = [];

    for (const role of roles) {
      const resolvedRole = this.guild.roles.resolveId(role);
      if (!resolvedRole) {
        return Promise.reject(new TypeError('INVALID_ELEMENT', 'Array', 'options.roles', role));
      }
      resolvedRoles.push(resolvedRole);
    }

    if (resolvedRoles.length) {
      query.include_roles = dry ? resolvedRoles.join(',') : resolvedRoles;
    }

    const endpoint = this.client.api.guilds(this.guild.id).prune;

    if (dry) {
      return endpoint.get({ query, reason }).then(data => data.pruned);
    }

    return endpoint
      .post({
        data: { ...query, compute_prune_count },
        reason,
      })
      .then(data => data.pruned);
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
   *   .then(user => console.log(`Kicked ${user.username ?? user.id ?? user} from ${guild.name}`))
   *   .catch(console.error);
   */
  async kick(user, reason) {
    const id = this.client.users.resolveId(user);
    if (!id) return Promise.reject(new TypeError('INVALID_TYPE', 'user', 'UserResolvable'));

    await this.client.api.guilds(this.guild.id).members(id).delete({ reason });

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
   *   .then(user => console.log(`Banned ${user.username ?? user.id ?? user} from ${guild.name}`))
   *   .catch(console.error);
   */
  ban(user, options = { days: 0 }) {
    return this.guild.bans.create(user, options);
  }

  /**
   * Unbans a user from the guild.
   * @param {UserResolvable} user The user to unban
   * @param {string} [reason] Reason for unbanning user
   * @returns {Promise<User>}
   * Internally calls the GuildBanManager#remove method.
   * @example
   * // Unban a user by id (or with a user/guild member object)
   * guild.members.unban('84484653687267328')
   *   .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *   .catch(console.error);
   */
  unban(user, reason) {
    return this.guild.bans.remove(user, reason);
  }

  _fetchSingle({ user, cache, force = false }) {
    if (!force) {
      const existing = this.cache.get(user);
      if (existing && !existing.partial) return Promise.resolve(existing);
    }

    return this.client.api
      .guilds(this.guild.id)
      .members(user)
      .get()
      .then(data => this._add(data, cache));
  }

  _fetchMany({
    limit = 0,
    withPresences: presences = false,
    user: user_ids,
    query,
    time = 120e3,
    nonce = SnowflakeUtil.generate(),
    force = false,
  } = {}) {
    return new Promise((resolve, reject) => {
      if (this.guild.memberCount === this.cache.size && !query && !limit && !presences && !user_ids && !force) {
        resolve(this.cache);
        return;
      }
      if (!query && !user_ids) query = '';
      if (nonce.length > 32) throw new RangeError('MEMBER_FETCH_NONCE_LENGTH');
      this.guild.shard.send({
        op: Opcodes.REQUEST_GUILD_MEMBERS,
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
      const option = Boolean(query || limit || presences || user_ids);
      let i = 0;
      const handler = (members, _, chunk) => {
        timeout.refresh();
        if (chunk.nonce !== nonce) return;
        i++;
        for (const member of members.values()) {
          if (option) fetchedMembers.set(member.id, member);
        }
        if (
          this.guild.memberCount <= this.cache.size ||
          (option && members.size < 1000) ||
          (limit && fetchedMembers.size >= limit) ||
          i === chunk.count
        ) {
          clearTimeout(timeout);
          this.client.removeListener(Events.GUILD_MEMBERS_CHUNK, handler);
          this.client.decrementMaxListeners();
          let fetched = option ? fetchedMembers : this.cache;
          if (user_ids && !Array.isArray(user_ids) && fetched.size) fetched = fetched.first();
          resolve(fetched);
        }
      };
      const timeout = setTimeout(() => {
        this.client.removeListener(Events.GUILD_MEMBERS_CHUNK, handler);
        this.client.decrementMaxListeners();
        reject(new Error('GUILD_MEMBERS_TIMEOUT'));
      }, time).unref();
      this.client.incrementMaxListeners();
      this.client.on(Events.GUILD_MEMBERS_CHUNK, handler);
    });
  }
}

module.exports = GuildMemberManager;
