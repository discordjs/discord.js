'use strict';

const BaseManager = require('./BaseManager');
const { TypeError } = require('../errors');
const Message = require('../structures/Message');
const Collection = require('../util/Collection');
const LimitedCollection = require('../util/LimitedCollection');

/**
 * Manages API methods for Messages and holds their cache.
 * @extends {BaseManager}
 */
class MessageManager extends BaseManager {
  constructor(channel, iterable) {
    super(channel.client, iterable, Message, LimitedCollection, channel.client.options.messageCacheMaxSize);
    /**
     * The channel that the messages belong to
     * @type {TextBasedChannel}
     */
    this.channel = channel;
  }

  /**
   * The cache of Messages
   * @type {Collection<Snowflake, Message>}
   * @name MessageManager#cache
   */

  add(data, cache) {
    return super.add(data, cache, { extras: [this.channel] });
  }

  /**
   * The parameters to pass in when requesting previous messages from a channel. `around`, `before` and
   * `after` are mutually exclusive. All the parameters are optional.
   * @typedef {Object} ChannelLogsQueryOptions
   * @property {number} [limit=50] Number of messages to acquire
   * @property {Snowflake} [before] ID of a message to get the messages that were posted before it
   * @property {Snowflake} [after] ID of a message to get the messages that were posted after it
   * @property {Snowflake} [around] ID of a message to get the messages that were posted around it
   */

  /**
   * Gets a message, or messages, from this channel.
   * <info>The returned Collection does not contain reaction users of the messages if they were not cached.
   * Those need to be fetched separately in such a case.</info>
   * @param {Snowflake|ChannelLogsQueryOptions} [message] The ID of the message to fetch, or query parameters.
   * @param {boolean} [cache=true] Whether to cache the message(s)
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<Message>|Promise<Collection<Snowflake, Message>>}
   * @example
   * // Get message
   * channel.messages.fetch('99539446449315840')
   *   .then(message => console.log(message.content))
   *   .catch(console.error);
   * @example
   * // Get messages
   * channel.messages.fetch({ limit: 10 })
   *   .then(messages => console.log(`Received ${messages.size} messages`))
   *   .catch(console.error);
   * @example
   * // Get messages and filter by user ID
   * channel.messages.fetch()
   *   .then(messages => console.log(`${messages.filter(m => m.author.id === '84484653687267328').size} messages`))
   *   .catch(console.error);
   */
  fetch(message, cache = true, force = false) {
    return typeof message === 'string' ? this._fetchId(message, cache, force) : this._fetchMany(message, cache);
  }

  /**
   * Fetches the pinned messages of this channel and returns a collection of them.
   * <info>The returned Collection does not contain any reaction data of the messages.
   * Those need to be fetched separately.</info>
   * @param {boolean} [cache=true] Whether to cache the message(s)
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // Get pinned messages
   * channel.messages.fetchPinned()
   *   .then(messages => console.log(`Received ${messages.size} messages`))
   *   .catch(console.error);
   */
  fetchPinned(cache = true) {
    return this.client.api.channels[this.channel.id].pins.get().then(data => {
      const messages = new Collection();
      for (const message of data) messages.set(message.id, this.add(message, cache));
      return messages;
    });
  }

  /**
   * Data that can be resolved to a Message object. This can be:
   * * A Message
   * * A Snowflake
   * @typedef {Message|Snowflake} MessageResolvable
   */

  /**
   * Resolves a MessageResolvable to a Message object.
   * @method resolve
   * @memberof MessageManager
   * @instance
   * @param {MessageResolvable} message The message resolvable to resolve
   * @returns {?Message}
   */

  /**
   * Resolves a MessageResolvable to a Message ID string.
   * @method resolveID
   * @memberof MessageManager
   * @instance
   * @param {MessageResolvable} message The message resolvable to resolve
   * @returns {?Snowflake}
   */

  /**
   * Deletes a message, even if it's not cached.
   * @param {MessageResolvable} message The message to delete
   * @param {string} [reason] Reason for deleting this message, if it does not belong to the client user
   * @returns {Promise<void>}
   */
  async delete(message, reason) {
    message = this.resolveID(message);
    if (!message) throw new TypeError('INVALID_TYPE', 'message', 'MessageResolvable');

    await this.client.api.channels(this.channel.id).messages(message).delete({ reason });
  }

  async _fetchId(messageID, cache, force) {
    if (!force) {
      const existing = this.cache.get(messageID);
      if (existing && !existing.partial) return existing;
    }

    const data = await this.client.api.channels[this.channel.id].messages[messageID].get();
    return this.add(data, cache);
  }

  async _fetchMany(options = {}, cache) {
    const data = await this.client.api.channels[this.channel.id].messages.get({ query: options });
    const messages = new Collection();
    for (const message of data) messages.set(message.id, this.add(message, cache));
    return messages;
  }
}

module.exports = MessageManager;
