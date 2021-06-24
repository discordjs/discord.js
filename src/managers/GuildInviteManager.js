'use strict';

const BaseManager = require('./BaseManager');
const { Error } = require('../errors');
const Invite = require('../structures/Invite');
const Collection = require('../util/Collection');
const DataResolver = require('../util/DataResolver');

/**
 * Manages API methods for GuildInvites and stores their cache.
 * @extends {BaseManager}
 */
class GuildInviteManager extends BaseManager {
  constructor(guild, iterable) {
    super(guild.client, iterable, Invite);

    /**
     * The guild this Manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, Invite>}
   * @name GuildInviteManager#cache
   */

  add(data, cache) {
    return super.add(data, cache, { id: data.code, extras: [this.guild] });
  }

  /**
   * Data that resolves to give a Invite object. This can be:
   * * An invite code
   * * An invite URL
   * @typedef {string} InviteResolvable
   */

  /**
   * Resolves a InviteResolvable to a Invite object.
   * @method resolve
   * @memberof GuildInviteManager
   * @instance
   * @param {InviteResolvable} invite The invite resolvable to resolve
   * @returns {?Invite}
   */

  /**
   * Resolves a InviteResolvable to a invite code string.
   * @method resolveID
   * @memberof GuildInviteManager
   * @instance
   * @param {InviteResolvable} invite The invite resolvable to resolve
   * @returns {?string}
   */

  /**
   * Options used to fetch a single invite from a guild.
   * @typedef {Object} FetchInviteOptions
   * @property {InviteResolvable} code The invite to fetch
   * @property {boolean} [cache=true] Whether or not to cache the fetched invite
   * @property {boolean} [force=false] Whether to skip the cache check and request the API
   */

  /**
   * Options used to fetch all invites from a guild.
   * @typedef {Object} FetchInvitesOptions
   * @property {boolean} cache Whether or not to cache the fetched invites
   */

  /**
   * Fetches invite(s) from Discord.
   * @param {InviteResolvable|FetchInviteOptions|FetchInvitesOptions} [options] Options for fetching guild invite(s)
   * @returns {Promise<Invite>|Promise<Collection<Snowflake, Invite>>}
   * @example
   * // Fetch all invites from a guild
   * guild.invites.fetch()
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch all invites from a guild without caching
   * guild.invites.fetch({ cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single invite
   * guild.invites.fetch('DrzKVU3')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single invite without checking cache
   * guild.invites.fetch({ code: 'DrzKVU3', force: true })
   *   .then(console.log)
   *   .catch(console.error)
   * @example
   * // Fetch a single invite without caching
   * guild.invites.fetch({ code: 'DrzKVU3', cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    if (typeof options === 'string') {
      const code = DataResolver.resolveInviteCode(options);
      if (!code) return Promise.reject(new Error('INVITE_RESOLVE_CODE'));
      return this._fetchSingle({ code, cache: true });
    }
    if (!options.code) {
      if ('cache' in options) return this._fetchMany(options.cache);
      return Promise.reject(new Error('INVITE_RESOLVE_CODE'));
    }
    return this._fetchSingle({
      ...options,
      code: DataResolver.resolveInviteCode(options.code),
    });
  }

  async _fetchSingle({ code, cache, force = false }) {
    if (!force) {
      const existing = this.cache.get(code);
      if (existing) return existing;
    }

    const invites = await this._fetchMany(cache);
    const invite = invites.get(code);
    if (!invite) throw new Error('INVITE_NOT_FOUND');
    return invite;
  }

  async _fetchMany(cache) {
    const data = await this.client.api.guilds(this.guild.id).invites.get();
    return data.reduce((col, invite) => col.set(invite.code, this.add(invite, cache)), new Collection());
  }

  /**
   * @typedef {CreateInviteOptions} CreateChannelInviteOptions
   * @property {GuildChannel} [channel] The optional channel to define where to create the invite.
   */

  /**
   * Create a invite to the guild from the provided or the first available channel.
   * @param {CreateChannelInviteOptions} [options={}] The options for creating the invite from a optional channel.
   * @returns {Promise<Invite>}
   * @example
   * // Create an invite to a random allowed channel
   * guild.invites.create()
   *   .then(invite => console.log(`Created an invite with a code of ${invite.code} from ${invite.channel}`))
   *   .catch(console.error);
   * @example
   * // Create an invite to a selected channel
   * guild.invites.create({ channel: '599942732013764608' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  create(options = {}) {
    let channel;

    if (options.channel) {
      channel = this.guild.channels.resolve(options.channel);
      if (!channel) return Promise.reject(new Error('GUILD_CHANNEL_RESOLVE'));
    } else {
      channel = this.guild.channels.cache.find(c => c.permissionsFor(this.guild.me).has('CREATE_INSTANT_INVITE'));
      if (!channel) return Promise.reject(new Error('GUILD_CHANNEL_INVITE'));
    }

    return channel.createInvite(options);
  }

  /**
   * Deletes a invite.
   * @param {InviteResolvable} invite The invite to delete
   * @param {string} [reason] Reason for deleting the invite
   * @returns {Promise<void>}
   */
  async delete(invite, reason) {
    const code = DataResolver.resolveInviteCode(invite);

    await this.client.api.invites(code).delete({ reason });
  }
}

module.exports = GuildInviteManager;
