'use strict';

const BaseManager = require('./BaseManager');
const { TypeError } = require('../errors');
const ThreadChannel = require('../structures/ThreadChannel');
const Collection = require('../util/Collection');
const { ChannelTypes } = require('../util/Constants');

/**
 * Manages API methods for ThreadChannels and stores their cache.
 * @extends {BaseManager}
 */
class ThreadManager extends BaseManager {
  constructor(channel, iterable) {
    super(channel.client, iterable, ThreadChannel);

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

  add(thread) {
    const existing = this.cache.get(thread.id);
    if (existing) return existing;
    this.cache.set(thread.id, thread);
    return thread;
  }

  /**
   * Data that can be resolved to give a Thread Channel object. This can be:
   * * A ThreadChannel object
   * * A Snowflake
   * @typedef {ThreadChannel|Snowflake} ThreadChannelResolvable
   */

  /**
   * Resolves a ThreadChannelResolvable to a Thread Channel object.
   * @method resolve
   * @memberof ThreadManager
   * @instance
   * @param {ThreadChannelResolvable} thread The ThreadChannel resolvable to resolve
   * @returns {?ThreadChannel}
   */

  /**
   * Resolves a ThreadChannelResolvable to a thread channel ID string.
   * @method resolveID
   * @memberof ThreadManager
   * @instance
   * @param {ThreadChannelResolvable} thread The ThreadChannel resolvable to resolve
   * @returns {?Snowflake}
   */

  /**
   * A number that is allowed to be the duration in minutes before a thread is automatically archived. This can be:
   * * `60` (1 hour)
   * * `1440` (1 day)
   * * `4320` (3 days) <warn>This is only available when the guild has the `THREE_DAY_THREAD_ARCHIVE` feature.</warn>
   * * `10080` (7 days) <warn>This is only available when the guild has the `SEVEN_DAY_THREAD_ARCHIVE` feature.</warn>
   * @typedef {number} ThreadAutoArchiveDuration
   */

  /**
   * Options for creating a thread <warn>Only one of `startMessage` or `type` can be defined.
   * If `startMessage` is defined, `type` is automatically defined and cannot be changed.</warn>
   * @typedef {Object} ThreadCreateOptions
   * @property {string} name The name of the new Thread
   * @property {ThreadAutoArchiveDuration} autoArchiveDuration How long before the thread is automatically archived
   * @property {MessageResolvable} [startMessage] The message to start a thread from
   * @property {ThreadChannelType|number} [type='public_thread'] The type of thread to create
   * <warn>When creating threads in a `news` channel this is ignored and is always `news_thread`</warn>
   * @property {string} [reason] Reason for creating the thread
   */

  /**
   * Creates a new thread in the channel.
   * @param {ThreadCreateOptions} [options] Options
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Create a new public thread
   * channel.threads
   *   .create({
   *     name: 'food-talk',
   *     autoArchiveDuration: 60,
   *     reason: 'Needed a separate thread for food',
   *   })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create a new private thread
   * channel.threads
   *   .create({
   *      name: 'mod-talk',
   *      autoArchiveDuration: 60,
   *      type: 'private_thread',
   *      reason: 'Needed a separate thread for moderation',
   *    })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async create({ name, autoArchiveDuration, startMessage, type, reason } = {}) {
    let path = this.client.api.channels(this.channel.id);
    if (type && typeof type !== 'string' && typeof type !== 'number') {
      throw new TypeError('INVALID_TYPE', 'type', 'ThreadChannelType or Number');
    }
    let resolvedType = this.channel.type === 'news' ? ChannelTypes.NEWS_THREAD : ChannelTypes.PUBLIC_THREAD;
    if (startMessage) {
      const startMessageID = this.channel.messages.resolveID(startMessage);
      if (!startMessageID) throw new TypeError('INVALID_TYPE', 'startMessage', 'MessageResolvable');
      path = path.messages(startMessageID);
    } else if (this.channel.type !== 'news') {
      resolvedType = typeof type === 'string' ? ChannelTypes[type.toUpperCase()] : type ?? resolvedType;
    }

    const data = await path.threads.post({
      data: {
        name,
        auto_archive_duration: autoArchiveDuration,
        type: resolvedType,
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
   * @param {ThreadChannelResolvable|FetchThreadsOptions} [options] If a ThreadChannelResolvable, the thread to fetch.
   * If undefined, fetches all active threads.
   * If an Object, fetches the specified threads.
   * @param {BaseFetchOptions} [cacheOptions] Additional options for this fetch
   * only applies when fetching a single thread
   * @returns {Promise<?(ThreadChannel|FetchedThreads)>}
   * @example
   * // Fetch a thread by its id
   * channel.threads.fetch('831955138126104859')
   *   .then(channel => console.log(channel.name))
   *   .catch(console.error);
   */
  fetch(options, { cache = true, force = false } = {}) {
    if (!options) return this.fetchActive(cache);
    const channel = this.client.channels.resolveID(options);
    if (channel) return this.client.channels.fetch(channel, cache, force);
    if (options.archived) {
      return this.fetchArchived(options.archived, cache);
    }
    return this.fetchActive(cache);
  }

  /**
   * Data that can be resolved to give a Date object. This can be:
   * * A Date object
   * * A number representing a timestamp
   * * An ISO8601 string
   * @typedef {Date|number|string} DateResolvable
   */

  /**
   * The options used to fetch archived threads.
   * @typedef {Object} FetchArchivedThreadOptions
   * @property {string} [type='public'] The type of threads to fetch, either `public` or `private`
   * @property {boolean} [fetchAll=false] When type is `private` whether to fetch **all** archived threads,
   * requires `MANAGE_THREADS` if true
   * @property {DateResolvable|ThreadChannelResolvable} [before] Identifier for a Date or Snowflake
   * to get threads that were created before it,
   * must be a ThreadChannelResolvable when type is `private` and fetchAll is `false`
   * @property {number} [limit] Maximum number of threads to return
   */

  /**
   * The data returned from a thread fetch that returns multiple threads.
   * @typedef {Object} FetchedThreads
   * @property {Collection<Snowflake, ThreadChannel>} threads The threads fetched, with any members returned
   * @property {?boolean} hasMore Whether there are potentially additional threads that require a subsequent call
   */

  /**
   * Obtains a set of archived threads from Discord, requires `READ_MESSAGE_HISTORY` in the parent channel.
   * @param {FetchArchivedThreadOptions} [options] The options to use when fetch archived threads
   * @param {boolean} [cache=true] Whether to cache the new thread objects if they aren't already
   * @returns {Promise<FetchedThreads>}
   */
  async fetchArchived({ type = 'public', fetchAll = false, before, limit } = {}, cache = true) {
    let path = this.client.api.channels(this.channel.id);
    if (type === 'private' && fetchAll) {
      path = path.users('@me');
    }
    let timestamp;
    let id;
    if (typeof before !== 'undefined') {
      if (before instanceof ThreadChannel || /^\d{16,19}$/.test(String(before))) {
        id = this.resolveID(before);
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
    return this._mapThreads(raw, cache);
  }

  /**
   * Obtains the accessible active threads from Discord, requires `READ_MESSAGE_HISTORY` in the parent channel.
   * @param {boolean} [cache=true] Whether to cache the new thread objects if they aren't already
   * @returns {Promise<FetchedThreads>}
   */
  async fetchActive(cache = true) {
    const raw = await this.client.api.channels(this.channel.id).threads.active.get();
    return this._mapThreads(raw, cache);
  }

  _mapThreads(rawThreads, cache) {
    const threads = rawThreads.threads.reduce((coll, raw) => {
      const thread = this.client.channels.add(raw, null, cache);
      return coll.set(thread.id, thread);
    }, new Collection());
    // Discord sends the thread id as id in this object
    for (const rawMember of rawThreads.members) threads.get(rawMember.id)?.members._add(rawMember);
    return {
      threads,
      hasMore: rawThreads.has_more,
    };
  }
}

module.exports = ThreadManager;
