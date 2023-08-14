'use strict';

const { Collection } = require('@discordjs/collection');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { DiscordjsError, ErrorCodes } = require('../errors');
const Invite = require('../structures/Invite');
const DataResolver = require('../util/DataResolver');

/**
 * Manages API methods for GuildInvites and stores their cache.
 * @extends {CachedManager}
 */
class GuildInviteManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, Invite, iterable);

    /**
     * The guild this Manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this Manager
   * @type {Collection<string, Invite>}
   * @name GuildInviteManager#cache
   */

  _add(data, cache) {
    return super._add(data, cache, { id: data.code, extras: [this.guild] });
  }

  /**
   * Data that resolves to give an Invite object. This can be:
   * * An invite code
   * * An invite URL
   * @typedef {string} InviteResolvable
   */

  /**
   * Data that can be resolved to a channel that an invite can be created on. This can be:
   * * TextChannel
   * * VoiceChannel
   * * NewsChannel
   * * StageChannel
   * * ForumChannel
   * * Snowflake
   * @typedef {TextChannel|VoiceChannel|NewsChannel|StageChannel|ForumChannel|Snowflake}
   * GuildInvitableChannelResolvable
   */

  /**
   * Resolves an InviteResolvable to an Invite object.
   * @method resolve
   * @memberof GuildInviteManager
   * @instance
   * @param {InviteResolvable} invite The invite resolvable to resolve
   * @returns {?Invite}
   */

  /**
   * Resolves an InviteResolvable to an invite code string.
   * @method resolveId
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
   * @property {GuildInvitableChannelResolvable} [channelId]
   * The channel to fetch all invites from
   * @property {boolean} [cache=true] Whether or not to cache the fetched invites
   */

  /**
   * Fetches invite(s) from Discord.
   * @param {InviteResolvable|FetchInviteOptions|FetchInvitesOptions} [options] Options for fetching guild invite(s)
   * @returns {Promise<Invite|Collection<string, Invite>>}
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
   * // Fetch all invites from a channel
   * guild.invites.fetch({ channelId: '222197033908436994' })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single invite
   * guild.invites.fetch('bRCvFy9')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single invite without checking cache
   * guild.invites.fetch({ code: 'bRCvFy9', force: true })
   *   .then(console.log)
   *   .catch(console.error)
   * @example
   * // Fetch a single invite without caching
   * guild.invites.fetch({ code: 'bRCvFy9', cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    if (typeof options === 'string') {
      const code = DataResolver.resolveInviteCode(options);
      if (!code) return Promise.reject(new DiscordjsError(ErrorCodes.InviteResolveCode));
      return this._fetchSingle({ code, cache: true });
    }
    if (!options.code) {
      if (options.channelId) {
        const id = this.guild.channels.resolveId(options.channelId);
        if (!id) return Promise.reject(new DiscordjsError(ErrorCodes.GuildChannelResolve));
        return this._fetchChannelMany(id, options.cache);
      }

      if ('cache' in options) return this._fetchMany(options.cache);
      return Promise.reject(new DiscordjsError(ErrorCodes.InviteResolveCode));
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
    if (!invite) throw new DiscordjsError(ErrorCodes.InviteNotFound);
    return invite;
  }

  async _fetchMany(cache) {
    const data = await this.client.rest.get(Routes.guildInvites(this.guild.id));
    return data.reduce((col, invite) => col.set(invite.code, this._add(invite, cache)), new Collection());
  }

  async _fetchChannelMany(channelId, cache) {
    const data = await this.client.rest.get(Routes.channelInvites(channelId));
    return data.reduce((col, invite) => col.set(invite.code, this._add(invite, cache)), new Collection());
  }

  /**
   * Create an invite to the guild from the provided channel.
   * @param {GuildInvitableChannelResolvable} channel The options for creating the invite from a channel.
   * @param {InviteCreateOptions} [options={}] The options for creating the invite from a channel.
   * @returns {Promise<Invite>}
   * @example
   * // Create an invite to a selected channel
   * guild.invites.create('599942732013764608')
   *   .then(console.log)
   *   .catch(console.error);
   */
  async create(
    channel,
    { temporary, maxAge, maxUses, unique, targetUser, targetApplication, targetType, reason } = {},
  ) {
    const id = this.guild.channels.resolveId(channel);
    if (!id) throw new DiscordjsError(ErrorCodes.GuildChannelResolve);

    const invite = await this.client.rest.post(Routes.channelInvites(id), {
      body: {
        temporary,
        max_age: maxAge,
        max_uses: maxUses,
        unique,
        target_user_id: this.client.users.resolveId(targetUser),
        target_application_id: targetApplication?.id ?? targetApplication?.applicationId ?? targetApplication,
        target_type: targetType,
      },
      reason,
    });
    return new Invite(this.client, invite);
  }

  /**
   * Deletes an invite.
   * @param {InviteResolvable} invite The invite to delete
   * @param {string} [reason] Reason for deleting the invite
   * @returns {Promise<void>}
   */
  async delete(invite, reason) {
    const code = DataResolver.resolveInviteCode(invite);

    await this.client.rest.delete(Routes.invite(code), { reason });
  }
}

module.exports = GuildInviteManager;
