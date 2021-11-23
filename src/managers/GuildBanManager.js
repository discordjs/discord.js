'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const { TypeError, Error } = require('../errors');
const GuildBan = require('../structures/GuildBan');
const GuildMember = require('../structures/GuildMember');

/**
 * Manages API methods for GuildBans and stores their cache.
 * @extends {CachedManager}
 */
class GuildBanManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, GuildBan, iterable);

    /**
     * The guild this Manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, GuildBan>}
   * @name GuildBanManager#cache
   */

  _add(data, cache) {
    return super._add(data, cache, { id: data.user.id, extras: [this.guild] });
  }

  /**
   * Data that resolves to give a GuildBan object. This can be:
   * * A GuildBan object
   * * A User resolvable
   * @typedef {GuildBan|UserResolvable} GuildBanResolvable
   */

  /**
   * Resolves a GuildBanResolvable to a GuildBan object.
   * @param {GuildBanResolvable} ban The ban that is in the guild
   * @returns {?GuildBan}
   */
  resolve(ban) {
    return super.resolve(ban) ?? super.resolve(this.client.users.resolveId(ban));
  }

  /**
   * Options used to fetch a single ban from a guild.
   * @typedef {BaseFetchOptions} FetchBanOptions
   * @property {UserResolvable} user The ban to fetch
   */

  /**
   * Options used to fetch all bans from a guild.
   * @typedef {Object} FetchBansOptions
   * @property {boolean} cache Whether or not to cache the fetched bans
   */

  /**
   * Fetches ban(s) from Discord.
   * @param {UserResolvable|FetchBanOptions|FetchBansOptions} [options] Options for fetching guild ban(s)
   * @returns {Promise<GuildBan|Collection<Snowflake, GuildBan>>}
   * @example
   * // Fetch all bans from a guild
   * guild.bans.fetch()
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch all bans from a guild without caching
   * guild.bans.fetch({ cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single ban
   * guild.bans.fetch('351871113346809860')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single ban without checking cache
   * guild.bans.fetch({ user, force: true })
   *   .then(console.log)
   *   .catch(console.error)
   * @example
   * // Fetch a single ban without caching
   * guild.bans.fetch({ user, cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const user = this.client.users.resolveId(options);
    if (user) return this._fetchSingle({ user, cache: true });
    options.user &&= this.client.users.resolveId(options.user);
    if (!options.user) {
      if ('cache' in options) return this._fetchMany(options.cache);
      return Promise.reject(new Error('FETCH_BAN_RESOLVE_ID'));
    }
    return this._fetchSingle(options);
  }

  async _fetchSingle({ user, cache, force = false }) {
    if (!force) {
      const existing = this.cache.get(user);
      if (existing && !existing.partial) return existing;
    }

    const data = await this.client.api.guilds(this.guild.id).bans(user).get();
    return this._add(data, cache);
  }

  async _fetchMany(cache) {
    const data = await this.client.api.guilds(this.guild.id).bans.get();
    return data.reduce((col, ban) => col.set(ban.user.id, this._add(ban, cache)), new Collection());
  }

  /**
   * Options used to ban a user from a guild.
   * @typedef {Object} BanOptions
   * @property {number} [days=0] Number of days of messages to delete, must be between 0 and 7, inclusive
   * @property {string} [reason] The reason for the ban
   */

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {BanOptions} [options] Options for the ban
   * @returns {Promise<GuildMember|User|Snowflake>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user id will be the result.
   * @example
   * // Ban a user by id (or with a user/guild member object)
   * guild.bans.create('84484653687267328')
   *   .then(banInfo => console.log(`Banned ${banInfo.user?.tag ?? banInfo.tag ?? banInfo}`))
   *   .catch(console.error);
   */
  async create(user, options = { days: 0 }) {
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    const id = this.client.users.resolveId(user);
    if (!id) throw new Error('BAN_RESOLVE_ID', true);
    await this.client.api
      .guilds(this.guild.id)
      .bans(id)
      .put({
        data: { delete_message_days: options.days },
        reason: options.reason,
      });
    if (user instanceof GuildMember) return user;
    const _user = this.client.users.resolve(id);
    if (_user) {
      return this.guild.members.resolve(_user) ?? _user;
    }
    return id;
  }

  /**
   * Unbans a user from the guild.
   * @param {UserResolvable} user The user to unban
   * @param {string} [reason] Reason for unbanning user
   * @returns {Promise<?User>}
   * @example
   * // Unban a user by id (or with a user/guild member object)
   * guild.bans.remove('84484653687267328')
   *   .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *   .catch(console.error);
   */
  async remove(user, reason) {
    const id = this.client.users.resolveId(user);
    if (!id) throw new Error('BAN_RESOLVE_ID');
    await this.client.api.guilds(this.guild.id).bans(id).delete({ reason });
    return this.client.users.resolve(user);
  }
}

module.exports = GuildBanManager;
