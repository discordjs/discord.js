'use strict';

const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { TypeError, ErrorCodes } = require('../errors');
const ThreadChannel = require('../structures/ThreadChannel');

/**
 * Manages API methods for thread-based channels and stores their cache.
 * @extends {CachedManager}
 */
class ThreadManager extends CachedManager {
  constructor(channel, iterable) {
    super(channel.client, ThreadChannel, iterable);

    /**
     * The channel this Manager belongs to
     * @type {TextChannel|NewsChannel|ForumChannel}
     */
    this.channel = channel;
  }

  /**
   * Data that can be resolved to a Thread Channel object. This can be:
   * * A ThreadChannel object
   * * A Snowflake
   * @typedef {ThreadChannel|Snowflake} ThreadChannelResolvable
   */

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, ThreadChannel>}
   * @name ThreadManager#cache
   */

  _add(thread) {
    const existing = this.cache.get(thread.id);
    if (existing) return existing;
    this.cache.set(thread.id, thread);
    return thread;
  }

  /**
   * Resolves a {@link ThreadChannelResolvable} to a {@link ThreadChannel} object.
   * @method resolve
   * @memberof ThreadManager
   * @instance
   * @param {ThreadChannelResolvable} thread The ThreadChannel resolvable to resolve
   * @returns {?ThreadChannel}
   */

  /**
   * Resolves a {@link ThreadChannelResolvable} to a {@link ThreadChannel} id.
   * @method resolveId
   * @memberof ThreadManager
   * @instance
   * @param {ThreadChannelResolvable} thread The ThreadChannel resolvable to resolve
   * @returns {?Snowflake}
   */

  /**
   * Options for creating a thread. <warn>Only one of `startMessage` or `type` can be defined.</warn>
   * @typedef {StartThreadOptions} ThreadCreateOptions
   * @property {MessageResolvable} [startMessage] The message to start a thread from. <warn>If this is defined then type
   * of thread gets automatically defined and cannot be changed. The provided `type` field will be ignored</warn>
   * @property {ChannelType.AnnouncementThread|ChannelType.PublicThread|ChannelType.PrivateThread} [type]
   * The type of thread to create.
   * Defaults to {@link ChannelType.PublicThread} if created in a {@link TextChannel}
   * <warn>When creating threads in a {@link NewsChannel} this is ignored and is always
   * {@link ChannelType.AnnouncementThread}</warn>
   * @property {boolean} [invitable] Whether non-moderators can add other non-moderators to the thread
   * <info>Can only be set when type will be {@link ChannelType.PrivateThread}</info>
   */

  /**
   * The options for fetching multiple threads, the properties are mutually exclusive
   * @typedef {Object} FetchThreadsOptions
   * @property {FetchArchivedThreadOptions} [archived] The options used to fetch archived threads
   * @property {boolean} [active] When true, fetches active threads. <warn>If `archived` is set, this is ignored!</warn>
   */

  /**
   * Obtains a thread from Discord, or the channel cache if it's already available.
   * @param {ThreadChannelResolvable|FetchThreadsOptions} [options] The options to fetch threads. If it is a
   * ThreadChannelResolvable then the specified thread will be fetched. Fetches all active threads if `undefined`
   * @param {BaseFetchOptions} [cacheOptions] Additional options for this fetch. <warn>The `force` field gets ignored
   * if `options` is not a {@link ThreadChannelResolvable}</warn>
   * @returns {Promise<?(ThreadChannel|FetchedThreads)>}
   * @example
   * // Fetch a thread by its id
   * channel.threads.fetch('831955138126104859')
   *   .then(channel => console.log(channel.name))
   *   .catch(console.error);
   */
  fetch(options, { cache = true, force = false } = {}) {
    if (!options) return this.fetchActive(cache);
    const channel = this.client.channels.resolveId(options);
    if (channel) return this.client.channels.fetch(channel, cache, force);
    if (options.archived) {
      return this.fetchArchived(options.archived, cache);
    }
    return this.fetchActive(cache);
  }

  /**
   * Data that can be resolved to a Date object. This can be:
   * * A Date object
   * * A number representing a timestamp
   * * An [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string
   * @typedef {Date|number|string} DateResolvable
   */

  /**
   * The options used to fetch archived threads.
   * @typedef {Object} FetchArchivedThreadOptions
   * @property {string} [type='public'] The type of threads to fetch (`public` or `private`)
   * @property {boolean} [fetchAll=false] Whether to fetch **all** archived threads when `type` is `private`
   * <info>This property requires the {@link PermissionFlagsBits.ManageThreads} permission if `true`.</info>
   * @property {DateResolvable|ThreadChannelResolvable} [before] Only return threads that were created before this Date
   * or Snowflake
   * <warn>Must be a {@link ThreadChannelResolvable} when `type` is `private` and `fetchAll` is `false`.</warn>
   * @property {number} [limit] Maximum number of threads to return
   */

  /**
   * The data returned from a thread fetch that returns multiple threads.
   * @typedef {Object} FetchedThreads
   * @property {Collection<Snowflake, ThreadChannel>} threads The threads that were fetched, with any members returned
   * @property {?boolean} hasMore Whether there are potentially additional threads that require a subsequent call
   */

  /**
   * Obtains a set of archived threads from Discord.
   * <info>This method requires the {@link PermissionFlagsBits.ReadMessageHistory} permission
   * in the parent channel.</info>
   * @param {FetchArchivedThreadOptions} [options] The options to fetch archived threads
   * @param {boolean} [cache=true] Whether to cache the new thread objects if they aren't already
   * @returns {Promise<FetchedThreads>}
   */
  async fetchArchived({ type = 'public', fetchAll = false, before, limit } = {}, cache = true) {
    let path = Routes.channelThreads(this.channel.id, type);
    if (type === 'private' && !fetchAll) {
      path = Routes.channelJoinedArchivedThreads(this.channel.id);
    }
    let timestamp;
    let id;
    const query = makeURLSearchParams({ limit });
    if (typeof before !== 'undefined') {
      if (before instanceof ThreadChannel || /^\d{16,19}$/.test(String(before))) {
        id = this.resolveId(before);
        timestamp = this.resolve(before)?.archivedAt?.toISOString();
        const toUse = type === 'private' && !fetchAll ? id : timestamp;
        if (toUse) {
          query.set('before', toUse);
        }
      } else {
        try {
          timestamp = new Date(before).toISOString();
          if (type === 'public' || fetchAll) {
            query.set('before', timestamp);
          }
        } catch {
          throw new TypeError(ErrorCodes.InvalidType, 'before', 'DateResolvable or ThreadChannelResolvable');
        }
      }
    }

    const raw = await this.client.rest.get(path, { query });
    return this.constructor._mapThreads(raw, this.client, { parent: this.channel, cache });
  }

  /**
   * Obtains the accessible active threads from Discord.
   * <info>This method requires the {@link PermissionFlagsBits.ReadMessageHistory} permission
   * in the parent channel.</info>
   * @param {boolean} [cache=true] Whether to cache the new thread objects if they aren't already
   * @returns {Promise<FetchedThreads>}
   */
  async fetchActive(cache = true) {
    const raw = await this.client.rest.get(Routes.guildActiveThreads(this.channel.guild.id));
    return this.constructor._mapThreads(raw, this.client, { parent: this.channel, cache });
  }

  static _mapThreads(rawThreads, client, { parent, guild, cache }) {
    const threads = rawThreads.threads.reduce((coll, raw) => {
      const thread = client.channels._add(raw, guild ?? parent?.guild, { cache });
      if (parent && thread.parentId !== parent.id) return coll;
      return coll.set(thread.id, thread);
    }, new Collection());
    // Discord sends the thread id as id in this object
    for (const rawMember of rawThreads.members) client.channels.cache.get(rawMember.id)?.members._add(rawMember);
    return {
      threads,
      hasMore: rawThreads.has_more ?? false,
    };
  }
}

module.exports = ThreadManager;
