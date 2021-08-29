'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const { TypeError } = require('../errors');
const ThreadChannel = require('../structures/ThreadChannel');
const { ChannelTypes } = require('../util/Constants');

/**
 * Manages API methods for {@link ThreadChannel} objects and stores their cache.
 * @extends {CachedManager}
 */
class ThreadManager extends CachedManager {
  constructor(channel, iterable) {
    super(channel.client, ThreadChannel, iterable);

    /**
     * The channel this Manager belongs to
     * @type {NewsChannel|TextChannel}
     */
    this.channel = channel;
  }

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
   * Data that can be resolved to a Thread Channel object. This can be:
   * * A ThreadChannel object
   * * A Snowflake
   * @typedef {ThreadChannel|Snowflake} ThreadChannelResolvable
   */

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
   * A number that is allowed to be the duration (in minutes) of inactivity after which a thread is automatically
   * archived. This can be:
   * * `60` (1 hour)
   * * `1440` (1 day)
   * * `4320` (3 days) <warn>This is only available when the guild has the `THREE_DAY_THREAD_ARCHIVE` feature.</warn>
   * * `10080` (7 days) <warn>This is only available when the guild has the `SEVEN_DAY_THREAD_ARCHIVE` feature.</warn>
   * * `'MAX'` Based on the guild's features
   * @typedef {number|string} ThreadAutoArchiveDuration
   */

  /**
   * Options for creating a thread. <warn>Only one of `startMessage` or `type` can be defined.</warn>
   * @typedef {StartThreadOptions} ThreadCreateOptions
   * @property {MessageResolvable} [startMessage] The message to start a thread from. <warn>If this is defined then type
   * of thread gets automatically defined and cannot be changed. The provided `type` field will be ignored</warn>
   * @property {ThreadChannelTypes|number} [type] The type of thread to create. Defaults to `GUILD_PUBLIC_THREAD` if
   * created in a {@link TextChannel} <warn>When creating threads in a {@link NewsChannel} this is ignored and is always
   * `GUILD_NEWS_THREAD`</warn>
   * @property {boolean} [invitable] Whether non-moderators can add other non-moderators to the thread
   * <info>Can only be set when type will be `GUILD_PRIVATE_THREAD`</info>
   */

  /**
   * Creates a new thread in the channel.
   * @param {ThreadCreateOptions} [options] Options to create a new thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Create a new public thread
   * channel.threads
   *   .create({
   *     name: 'food-talk',
   *     autoArchiveDuration: 60,
   *     reason: 'Needed a separate thread for food',
   *   })
   *   .then(threadChannel => console.log(threadChannel))
   *   .catch(console.error);
   * @example
   * // Create a new private thread
   * channel.threads
   *   .create({
   *      name: 'mod-talk',
   *      autoArchiveDuration: 60,
   *      type: 'GUILD_PRIVATE_THREAD',
   *      reason: 'Needed a separate thread for moderation',
   *    })
   *   .then(threadChannel => console.log(threadChannel))
   *   .catch(console.error);
   */
  async create({ name, autoArchiveDuration, startMessage, type, invitable, reason } = {}) {
    let path = this.client.api.channels(this.channel.id);
    if (type && typeof type !== 'string' && typeof type !== 'number') {
      throw new TypeError('INVALID_TYPE', 'type', 'ThreadChannelType or Number');
    }
    let resolvedType =
      this.channel.type === 'GUILD_NEWS' ? ChannelTypes.GUILD_NEWS_THREAD : ChannelTypes.GUILD_PUBLIC_THREAD;
    if (startMessage) {
      const startMessageId = this.channel.messages.resolveId(startMessage);
      if (!startMessageId) throw new TypeError('INVALID_TYPE', 'startMessage', 'MessageResolvable');
      path = path.messages(startMessageId);
    } else if (this.channel.type !== 'GUILD_NEWS') {
      resolvedType = typeof type === 'string' ? ChannelTypes[type] : type ?? resolvedType;
    }
    if (autoArchiveDuration === 'MAX') {
      autoArchiveDuration = 1440;
      if (this.channel.guild.features.includes('SEVEN_DAY_THREAD_ARCHIVE')) {
        autoArchiveDuration = 10080;
      } else if (this.channel.guild.features.includes('THREE_DAY_THREAD_ARCHIVE')) {
        autoArchiveDuration = 4320;
      }
    }

    const data = await path.threads.post({
      data: {
        name,
        auto_archive_duration: autoArchiveDuration,
        type: resolvedType,
        invitable: resolvedType === ChannelTypes.GUILD_PRIVATE_THREAD ? invitable : undefined,
      },
      reason,
    });

    return this.client.actions.ThreadCreate.handle(data).thread;
  }

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
   * @property {string} [type='public'] The type of threads to fetch, either `public` or `private`
   * @property {boolean} [fetchAll=false] Whether to fetch **all** archived threads when type is `private`.
   * Requires `MANAGE_THREADS` if true
   * @property {DateResolvable|ThreadChannelResolvable} [before] Only return threads that were created before this Date
   * or Snowflake. <warn>Must be a {@link ThreadChannelResolvable} when type is `private` and fetchAll is `false`</warn>
   * @property {number} [limit] Maximum number of threads to return
   */

  /**
   * The data returned from a thread fetch that returns multiple threads.
   * @typedef {Object} FetchedThreads
   * @property {Collection<Snowflake, ThreadChannel>} threads The threads that were fetched, with any members returned
   * @property {?boolean} hasMore Whether there are potentially additional threads that require a subsequent call
   */

  /**
   * Obtains a set of archived threads from Discord, requires `READ_MESSAGE_HISTORY` in the parent channel.
   * @param {FetchArchivedThreadOptions} [options] The options to fetch archived threads
   * @param {boolean} [cache=true] Whether to cache the new thread objects if they aren't already
   * @returns {Promise<FetchedThreads>}
   */
  async fetchArchived({ type = 'public', fetchAll = false, before, limit } = {}, cache = true) {
    let path = this.client.api.channels(this.channel.id);
    if (type === 'private' && !fetchAll) {
      path = path.users('@me');
    }
    let timestamp;
    let id;
    if (typeof before !== 'undefined') {
      if (before instanceof ThreadChannel || /^\d{16,19}$/.test(String(before))) {
        id = this.resolveId(before);
        timestamp = this.resolve(before)?.archivedAt?.toISOString();
      } else {
        try {
          timestamp = new Date(before).toISOString();
        } catch {
          throw new TypeError('INVALID_TYPE', 'before', 'DateResolvable or ThreadChannelResolvable');
        }
      }
    }
    const raw = await path.threads
      .archived(type)
      .get({ query: { before: type === 'private' && !fetchAll ? id : timestamp, limit } });
    return this.constructor._mapThreads(raw, this.client, { parent: this.channel, cache });
  }

  /**
   * Obtains the accessible active threads from Discord, requires `READ_MESSAGE_HISTORY` in the parent channel.
   * @param {boolean} [cache=true] Whether to cache the new thread objects if they aren't already
   * @returns {Promise<FetchedThreads>}
   */
  async fetchActive(cache = true) {
    const raw = await this.client.api.guilds(this.channel.guild.id).threads.active.get();
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
