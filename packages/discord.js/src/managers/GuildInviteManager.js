'use strict';

const { Buffer } = require('node:buffer');
const { Collection } = require('@discordjs/collection');
const { Routes } = require('discord-api-types/v10');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');
const { GuildInvite } = require('../structures/GuildInvite.js');
const { resolveInviteCode, resolveFile } = require('../util/DataResolver.js');
const { CachedManager } = require('./CachedManager.js');
/**
 * Manages API methods for GuildInvites and stores their cache.
 *
 * @extends {CachedManager}
 */
class GuildInviteManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, GuildInvite, iterable);

    /**
     * The guild this Manager belongs to
     *
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this Manager
   *
   * @type {Collection<string, GuildInvite>}
   * @name GuildInviteManager#cache
   */

  _add(data, cache) {
    return super._add(data, cache, { id: data.code, extras: [this.guild] });
  }

  /**
   * Data that resolves to give a `GuildInvite`. This can be:
   *
   * - An invite code
   * - An invite URL
   *
   * @typedef {string} GuildInviteResolvable
   */

  /**
   * A guild channel where an invite may be created on. This can be:
   * - TextChannel
   * - VoiceChannel
   * - AnnouncementChannel
   * - StageChannel
   * - ForumChannel
   * - MediaChannel
   *
   * @typedef {TextChannel|VoiceChannel|AnnouncementChannel|StageChannel|ForumChannel|MediaChannel}
   * GuildInvitableChannel
   */

  /**
   * Data that can be resolved to a guild channel where an invite may be created on. This can be:
   * - GuildInvitableChannel
   * - Snowflake
   *
   * @typedef {GuildInvitableChannel|Snowflake}
   * GuildInvitableChannelResolvable
   */

  /**
   * Resolves an `GuildInviteResolvable` to a `GuildInvite` object.
   *
   * @method resolve
   * @memberof GuildInviteManager
   * @instance
   * @param {GuildInviteResolvable} invite The invite resolvable to resolve
   * @returns {?GuildInvite}
   */

  /**
   * Resolves an InviteResolvable to an invite code string.
   *
   * @method resolveId
   * @memberof GuildInviteManager
   * @instance
   * @param {InviteResolvable} invite The invite resolvable to resolve
   * @returns {?string}
   */

  /**
   * Options used to fetch a single invite from a guild.
   *
   * @typedef {Object} FetchInviteOptions
   * @property {InviteResolvable} code The invite to fetch
   * @property {boolean} [cache=true] Whether or not to cache the fetched invite
   * @property {boolean} [force=false] Whether to skip the cache check and request the API
   */

  /**
   * Options used to fetch all invites from a guild.
   *
   * @typedef {Object} FetchInvitesOptions
   * @property {GuildInvitableChannelResolvable} [channelId]
   * The channel to fetch all invites from
   * @property {boolean} [cache=true] Whether or not to cache the fetched invites
   */

  /**
   * Job status for target users of an invite
   *
   * @typedef {Object} TargetUsersJobStatusForInvite
   * @property {InviteTargetUsersJobStatus} status The status of job processing the users
   * @property {number} totalUsers The total number of users provided in the list
   * @property {number} processedUsers The total number of users processed so far
   * @property {Date|null} createdAt The time when the job was created
   * @property {Date|null} completedAt The time when the job was successfully completed
   * @property {string|null} errorMessage The error message if the job failed
   */

  /**
   * Fetches invite(s) from Discord.
   *
   * @param {GuildInviteResolvable|FetchInviteOptions|FetchInvitesOptions} [options]
   * Options for fetching guild invite(s)
   * @returns {Promise<GuildInvite|Collection<string, GuildInvite>>}
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
  async fetch(options) {
    if (!options) return this._fetchMany();
    if (typeof options === 'string') {
      const code = resolveInviteCode(options);
      if (!code) throw new DiscordjsError(ErrorCodes.InviteResolveCode);
      return this._fetchSingle({ code, cache: true });
    }

    if (!options.code) {
      if (options.channelId) {
        const id = this.guild.channels.resolveId(options.channelId);
        if (!id) throw new DiscordjsError(ErrorCodes.GuildChannelResolve);
        return this._fetchChannelMany(id, options.cache);
      }

      if ('cache' in options) return this._fetchMany(options.cache);
      throw new DiscordjsError(ErrorCodes.InviteResolveCode);
    }

    return this._fetchSingle({
      ...options,
      code: resolveInviteCode(options.code),
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
   *
   * @param {GuildInvitableChannelResolvable} channel The channel where invite should be created.
   * @param {InviteCreateOptions} [options={}] The options for creating the invite from a channel.
   * @returns {Promise<GuildInvite>}
   * @example
   * // Create an invite to a selected channel
   * guild.invites.create('599942732013764608')
   *   .then(console.log)
   *   .catch(console.error);
   */
  async create(
    channel,
    {
      temporary,
      maxAge,
      maxUses,
      unique,
      targetUser,
      targetApplication,
      targetType,
      roles,
      targetUsersFile,
      reason,
    } = {},
  ) {
    const id = this.guild.channels.resolveId(channel);
    if (!id) throw new DiscordjsError(ErrorCodes.GuildChannelResolve);
    const options = {
      temporary,
      max_age: maxAge,
      max_uses: maxUses,
      unique,
      target_user_id: this.client.users.resolveId(targetUser),
      target_application_id: targetApplication?.id ?? targetApplication?.applicationId ?? targetApplication,
      role_ids: roles?.map(role => this.guild.roles.resolveId(role)),
      target_type: targetType,
    };
    const invite = await this.client.rest.post(Routes.channelInvites(id), {
      body: targetUsersFile ? await this._createInviteFormData({ targetUsersFile, ...options }) : options,
      // This is necessary otherwise rest stringifies the body
      passThroughBody: Boolean(targetUsersFile),
      reason,
    });

    return new GuildInvite(this.client, invite);
  }

  /**
   * Deletes an invite.
   *
   * @param {InviteResolvable} invite The invite to delete
   * @param {string} [reason] Reason for deleting the invite
   * @returns {Promise<void>}
   */
  async delete(invite, reason) {
    const code = resolveInviteCode(invite);

    await this.client.rest.delete(Routes.invite(code), { reason });
  }

  /**
   * Get target users for an invite
   *
   * @param {InviteResolvable} invite The invite to get the target users
   * @returns {Buffer} The csv file containing target users
   */
  async fetchTargetUsers(invite) {
    const code = resolveInviteCode(invite);
    const arrayBuff = await this.client.rest.get(Routes.inviteTargetUsers(code));

    return Buffer.from(arrayBuff);
  }

  /**
   * Updates target users for an invite
   *
   * @param {InviteResolvable} invite The invite to update the target users
   * @param {UserResolvable[]|BufferResolvable} targetUsersFile An array of users or a csv file with a single column of user IDs
   * for all the users able to accept this invite
   * @returns {Promise<unknown>}
   */
  async updateTargetUsers(invite, targetUsersFile) {
    const code = resolveInviteCode(invite);

    return this.client.rest.put(Routes.inviteTargetUsers(code), {
      body: await this._createInviteFormData({ targetUsersFile }),
      // This is necessary otherwise rest stringifies the body
      passThroughBody: true,
    });
  }

  /**
   * Get status of the job processing target users of an invite
   *
   * @param {InviteResolvable} invite The invite to get the target users for
   * @returns {TargetUsersJobStatusForInvite[]} The target users
   */
  async fetchTargetUsersJobStatus(invite) {
    const code = resolveInviteCode(invite);
    const job = await this.client.rest.get(Routes.inviteTargetUsersJobStatus(code));
    return {
      status: job.status,
      totalUsers: job.total_users,
      processedUsers: job.processed_users,
      createdAt: job.created_at ? new Date(job.created_at) : null,
      completedAt: job.completed_at ? new Date(job.completed_at) : null,
      errorMessage: job.error_message ?? null,
    };
  }

  /**
   * Creates form data body payload for invite
   *
   * @param {InviteCreateOptions} options The options for creating invite
   * @returns {Promise<FormData>}
   * @private
   */
  async _createInviteFormData({ targetUsersFile, ...rest } = {}) {
    const formData = new FormData();
    let usersCsv;
    if (Array.isArray(targetUsersFile)) {
      usersCsv = targetUsersFile.map(user => this.client.users.resolveId(user)).join('\n');
    } else {
      const resolved = await resolveFile(targetUsersFile);
      usersCsv = resolved.data.toString('utf8');
    }

    formData.append('target_users_file', new Blob([usersCsv], { type: 'text/csv' }), 'users.csv');
    formData.append('payload_json', JSON.stringify(rest));
    return formData;
  }
}

exports.GuildInviteManager = GuildInviteManager;
