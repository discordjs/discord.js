const DataStore = require('./DataStore');
const Collection = require('../util/Collection');
const Message = require('../structures/Message');
const { Error, TypeError } = require('../errors');
const Snowflake = require('../util/Snowflake');

/**
 * Stores messages for text-based channels.
 * @extends {DataStore}
 */
class MessageStore extends DataStore {
  constructor(channel, iterable) {
    super(channel.client, iterable, Message);
    this.channel = channel;
  }

  add(data, cache) {
    return super.add(data, cache, { extras: [this.channel] });
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
      for (const message of data) messages.set(message.id, this.add(message));
      return messages;
    });
  }

  /**
   * Bulk deletes given messages that are newer than two weeks.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Collection<Snowflake, Message>|Message[]|Snowflake[]|number} messages
   * Messages or number of messages to delete
   * @param {boolean} [filterOld=false] Filter messages to remove those which are older than two weeks automatically
   * @returns {Promise<Collection<Snowflake, Message>>} Deleted messages
   * @example
   * // Bulk delete messages
   * channel.messages.bulkDelete(5)
   *   .then(messages => console.log(`Deleted ${messages.size} messages`))
   *   .catch(console.error);
   */
  async bulkDelete(messages, filterOld = false) {
    if (messages instanceof Array || messages instanceof Collection) {
      let messageIDs = messages instanceof Collection ? messages.keyArray() : messages.map(m => m.id || m);
      if (filterOld) {
        messageIDs = messageIDs.filter(id =>
          Date.now() - Snowflake.deconstruct(id).date.getTime() < 1209600000
        );
      }
      if (messageIDs.length === 0) return new Collection();
      if (messageIDs.length === 1) {
        await this.client.api.channels(this.channel.id).messages(messageIDs[0]).delete();
        const message = this.client.actions.MessageDelete.handle({
          channel_id: this.channel.id,
          id: messageIDs[0],
        }).message;
        if (message) return new Collection([[message.id, message]]);
        return new Collection();
      }
      await this.client.api.channels[this.channel.id].messages['bulk-delete']
        .post({ data: { messages: messageIDs } });
      return this.client.actions.MessageDeleteBulk.handle({
        channel_id: this.channel.id,
        ids: messageIDs,
      }).messages;
    }
    if (!isNaN(messages)) {
      const msgs = await this.fetch({ limit: messages });
      return this.bulkDelete(msgs, filterOld);
    }
    throw new TypeError('MESSAGE_BULK_DELETE_TYPE');
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
      .then(data => this.add(data));
  }

  _fetchMany(options = {}) {
    return this.client.api.channels[this.channel.id].messages.get({ query: options })
      .then(data => {
        const messages = new Collection();
        for (const message of data) messages.set(message.id, this.add(message));
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
