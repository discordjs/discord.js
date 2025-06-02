'use strict';

const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');
const { ThreadChannel } = require('../structures/ThreadChannel.js');
const { MakeCacheOverrideSymbol } = require('../util/Symbols.js');
const { CachedManager } = require('./CachedManager.js');

/**
 * Manages API methods for thread-based channels and stores their cache.
 *
 * @extends {CachedManager}
 */
class ThreadManager extends CachedManager {
  static [MakeCacheOverrideSymbol] = ThreadManager;

  constructor(channel, iterable) {
    super(channel.client, ThreadChannel, iterable);

    /**
     * The channel this Manager belongs to
     *
     * @type {TextChannel|AnnouncementChannel|ForumChannel|MediaChannel}
     */
    this.channel = channel;
  }

  /**
   * Data that can be resolved to a Thread Channel object. This can be:
   * - A ThreadChannel object
   * - A Snowflake
   *
   * @typedef {ThreadChannel|Snowflake} ThreadChannelResolvable
   */

  /**
   * The cache of this Manager
   *
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
   *
   * @method resolve
   * @memberof ThreadManager
   * @instance
   * @param {ThreadChannelResolvable} thread The ThreadChannel resolvable to resolve
   * @returns {?ThreadChannel}
   */

  /**
   * Resolves a {@link ThreadChannelResolvable} to a {@link ThreadChannel} id.
   *
   * @method resolveId
   * @memberof ThreadManager
   * @instance
   * @param {ThreadChannelResolvable} thread The ThreadChannel resolvable to resolve
   * @returns {?Snowflake}
   */

  /**
   * Options for fetching multiple threads.
   *
   * @typedef {Object} FetchThreadsOptions
   * @property {FetchArchivedThreadOptions} [archived] Options used to fetch archived threads
   */

  /**
   * Obtains a thread from Discord, or the channel cache if it's already available.
   *
   * @param {ThreadChannelResolvable|FetchThreadsOptions} [options] The options to fetch threads. If it is a
   * ThreadChannelResolvable then the specified thread will be fetched. Fetches all active threads if `undefined`
   * @param {BaseFetchOptions} [cacheOptions] Additional options for this fetch. <warn>The `force` field gets ignored
   * if `options` is not a {@link ThreadChannelResolvable}</warn>
   * @returns {Promise<?(ThreadChannel|FetchedThreads|FetchedThreadsMore)>}
   * {@link FetchedThreads} if active & {@link FetchedThreadsMore} if archived.
   * @example
   * // Fetch a thread by its id
   * channel.threads.fetch('831955138126104859')
   *   .then(channel => console.log(channel.name))
   *   .catch(console.error);
   */
  async fetch(options, { cache, force } = {}) {
    if (!options) return this.fetchActive(cache);
    const channel = this.client.channels.resolveId(options);
    if (channel) {
      const threadChannel = await this.client.channels.fetch(channel, { cache, force });
      if (threadChannel.parentId !== this.channel.id) throw new DiscordjsTypeError(ErrorCodes.NotAThreadOfParent);
      return threadChannel;
    }

    if (options.archived) {
      return this.fetchArchived(options.archived, cache);
    }

    return this.fetchActive(cache);
  }

  /**
   * Data that can be resolved to a Date object. This can be:
   * - A Date object
   * - A number representing a timestamp
   * - An {@link https://en.wikipedia.org/wiki/ISO_8601 ISO 8601} string
   *
   * @typedef {Date|number|string} DateResolvable
   */

  /**
   * The options used to fetch archived threads.
   *
   * @typedef {Object} FetchArchivedThreadOptions
   * @property {string} [type='public'] The type of threads to fetch (`public` or `private`)
   * @property {boolean} [fetchAll=false] Whether to fetch **all** archived threads when `type` is `private`
   * <info>This property requires the {@link PermissionFlagsBits.ManageThreads} permission if `true`.</info>
   * @property {DateResolvable|ThreadChannelResolvable} [before] Only return threads that were archived before this Date
   * or Snowflake
   * <warn>Must be a {@link ThreadChannelResolvable} when `type` is `private` and `fetchAll` is `false`.</warn>
   * @property {number} [limit] Maximum number of threads to return
   */

  /**
   * Data returned from fetching multiple threads.
   *
   * @typedef {FetchedThreads} FetchedThreadsMore
   * @property {?boolean} hasMore Whether there are potentially additional threads that require a subsequent call
   */

  /**
   * Obtains a set of archived threads from Discord.
   * <info>This method requires the {@link PermissionFlagsBits.ReadMessageHistory} permission
   * in the parent channel.</info>
   *
   * @param {FetchArchivedThreadOptions} [options] The options to fetch archived threads
   * @param {boolean} [cache=true] Whether to cache the new thread objects if they aren't already
   * @returns {Promise<FetchedThreadsMore>}
   */
  async fetchArchived({ type = 'public', fetchAll = false, before, limit } = {}, cache = true) {
    let path = Routes.channelThreads(this.channel.id, type);
    if (type === 'private' && !fetchAll) {
      path = Routes.channelJoinedArchivedThreads(this.channel.id);
    }

    let timestamp;
    let id;
    const query = makeURLSearchParams({ limit });
    if (before !== undefined) {
      if (before instanceof ThreadChannel || /^\d{17,19}$/.test(String(before))) {
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
          throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'before', 'DateResolvable or ThreadChannelResolvable');
        }
      }
    }

    const raw = await this.client.rest.get(path, { query });
    return this.constructor._mapThreads(raw, this.client, { parent: this.channel, cache });
  }

  /**
   * Obtains all active threads in the channel.
   *
   * @param {boolean} [cache=true] Whether to cache the fetched data
   * @returns {Promise<FetchedThreads>}
   */
  async fetchActive(cache = true) {
    const data = await this.channel.guild.channels.rawFetchGuildActiveThreads();
    return this.constructor._mapThreads(data, this.client, { parent: this.channel, cache });
  }

  static _mapThreads(rawThreads, client, { parent, guild, cache }) {
    const threads = rawThreads.threads.reduce((coll, raw) => {
      const thread = client.channels._add(raw, guild ?? parent?.guild, { cache });
      if (parent && thread.parentId !== parent.id) return coll;
      return coll.set(thread.id, thread);
    }, new Collection());

    // Discord sends the thread id as id in this object
    const threadMembers = rawThreads.members.reduce((coll, raw) => {
      const thread = threads.get(raw.id);
      return thread ? coll.set(raw.user_id, thread.members._add(raw)) : coll;
    }, new Collection());

    const response = { threads, members: threadMembers };

    // The GET `/guilds/{guild.id}/threads/active` route does not return `has_more`.
    if ('has_more' in rawThreads) response.hasMore = rawThreads.has_more;
    return response;
  }
}

exports.ThreadManager = ThreadManager;
