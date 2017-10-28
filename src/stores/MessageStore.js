const DataStore = require('./DataStore');
const Collection = require('../util/Collection');
const Message = require('../structures/Message');
const { Error } = require('../errors');

/**
 * Stores messages for text-based channels.
 * @extends {DataStore}
 */
class MessageStore extends DataStore {
  constructor(channel, iterable) {
    super(channel.client, iterable, Message);
    this.channel = channel;
  }

  create(data, cache) {
    return super.create(data, cache, { extras: [this.channel] });
  }

  set(key, value) {
    const maxSize = this.client.options.messageCacheMaxSize;
    if (maxSize === 0) return;
    if (this.size >= maxSize && maxSize > 0) this.delete(this.firstKey());
    super.set(key, value);
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
   * @param {Snowflake|ChannelLogsQueryOptions} [message] The ID of the message to fetch, or query parameters.
   * @returns {Promise<Message>|Promise<Collection<Snowflake, Message>>}
   * @example
   * // Get message
   * channel.messages.fetch('99539446449315840')
   *   .then(message => console.log(message.content))
   *   .catch(console.error);
   * @example
   * // Get messages
   * channel.messages.fetch({limit: 10})
   *   .then(messages => console.log(`Received ${messages.size} messages`))
   *   .catch(console.error);
   */
  fetch(message) {
    return typeof message === 'string' ? this._fetchId(message) : this._fetchMany(message);
  }

  /**
   * Fetches the pinned messages of this channel and returns a collection of them.
   * <info>The returned Collection does not contain the reactions of the messages.
   * Those need to be fetched seperately.</info>
   * @returns {Promise<Collection<Snowflake, Message>>}
   */
  fetchPinned() {
    return this.client.api.channels[this.channel.id].pins.get().then(data => {
      const messages = new Collection();
      for (const message of data) messages.set(message.id, this.create(message));
      return messages;
    });
  }

  _fetchId(messageID) {
    if (!this.client.user.bot) {
      return this._fetchMany({ limit: 1, around: messageID })
        .then(messages => {
          const msg = messages.get(messageID);
          if (!msg) throw new Error('MESSAGE_MISSING');
          return msg;
        });
    }
    return this.client.api.channels[this.channel.id].messages[messageID].get()
      .then(data => this.create(data));
  }

  _fetchMany(options = {}) {
    return this.client.api.channels[this.channel.id].messages.get({ query: options })
      .then(data => {
        const messages = new Collection();
        for (const message of data) messages.set(message.id, this.create(message));
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
    * @memberof MessageStore
    * @instance
    * @param {MessageResolvable} message The message resolvable to resolve
    * @returns {?Message}
    */

  /**
    * Resolves a MessageResolvable to a Message ID string.
    * @method resolveID
    * @memberof MessageStore
    * @instance
    * @param {MessageResolvable} message The message resolvable to resolve
    * @returns {?Snowflake}
    */
}

module.exports = MessageStore;
