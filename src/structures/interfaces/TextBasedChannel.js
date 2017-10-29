const MessageCollector = require('../MessageCollector');
const Shared = require('../shared');
const Snowflake = require('../../util/Snowflake');
const Collection = require('../../util/Collection');
const { RangeError, TypeError } = require('../../errors');

/**
 * Interface for classes that have text-channel-like features.
 * @interface
 */
class TextBasedChannel {
  constructor() {
    /**
     * A collection containing the messages sent to this channel
     * @type {MessageStore<Snowflake, Message>}
     */
    this.messages = new MessageStore(this);

    /**
     * The ID of the last message in the channel, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message in the channel, if one was sent
     * @type {?Message}
     */
    this.lastMessage = null;
  }

  /**
   * Options provided when sending or editing a message.
   * @typedef {Object} MessageOptions
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {string} [content=''] The content for the message
   * @property {MessageEmbed|Object} [embed] An embed for the message
   * (see [here](https://discordapp.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   * @property {FileOptions[]|BufferResolvable[]} [files] Files to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message
   * @property {UserResolvable} [reply] User to reply to (prefixes the message with a mention, except in DMs)
   */

  /**
   * @typedef {Object} FileOptions
   * @property {BufferResolvable} attachment File to attach
   * @property {string} [name='file.jpg'] Filename of the attachment
   */

  /**
   * Options for splitting a message.
   * @typedef {Object} SplitOptions
   * @property {number} [maxLength=1950] Maximum character length per message piece
   * @property {string} [char='\n'] Character to split the message with
   * @property {string} [prepend=''] Text to prepend to every piece except the first
   * @property {string} [append=''] Text to append to every piece except the last
   */

  /**
   * Sends a message to this channel.
   * @param {StringResolvable} [content] Text for the message
   * @param {MessageOptions|MessageEmbed|MessageAttachment|MessageAttachment[]} [options={}] Options for the message
   * @returns {Promise<Message|Message[]>}
   * @example
   * // Sends a message
   * channel.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   */
  send(content, options) { // eslint-disable-line complexity
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = null;
    } else if (!options) {
      options = {};
    }
    if (!options.content) options.content = content;

    return Shared.sendMessage(this, options);
  }

  /**
   * Performs a search within the channel.
   * <warn>This is only available when using a user account.</warn>
   * @param {MessageSearchOptions} [options={}] Options to pass to the search
   * @returns {Promise<MessageSearchResult>}
   * @example
   * channel.search({
   *   content: 'discord.js',
   *   before: '2016-11-17'
   * }).then(res => {
   *   const hit = res.results[0].find(m => m.hit).content;
   *   console.log(`I found: **${hit}**, total results: ${res.total}`);
   * }).catch(console.error);
   */
  search(options = {}) {
    return Shared.search(this, options);
  }

  /**
   * Starts a typing indicator in the channel.
   * @param {number} [count=1] The number of times startTyping should be considered to have been called
   * @returns {Promise} Resolves once the bot stops typing gracefully, or rejects when an error occurs
   * @example
   * // Start typing in a channel, or increase the typing count by one
   * channel.startTyping();
   * @example
   * // Start typing in a channel with a typing count of five, or set it to five
   * channel.startTyping(5);
   */
  startTyping(count) {
    if (typeof count !== 'undefined' && count < 1) throw new RangeError('TYPING_COUNT');
    if (this.client.user._typing.has(this.id)) {
      const entry = this.client.user._typing.get(this.id);
      entry.count = count || entry.count + 1;
      return entry.promise;
    }

    const entry = {};
    entry.promise = new Promise((resolve, reject) => {
      const endpoint = this.client.api.channels[this.id].typing;
      Object.assign(entry, {
        count: count || 1,
        interval: this.client.setInterval(() => {
          endpoint.post().catch(error => {
            this.client.clearInterval(entry.interval);
            this.client.user._typing.delete(this.id);
            reject(error);
          });
        }, 9000),
        resolve,
      });
      endpoint.post().catch(error => {
        this.client.clearInterval(entry.interval);
        this.client.user._typing.delete(this.id);
        reject(error);
      });
      this.client.user._typing.set(this.id, entry);
    });
    return entry.promise;
  }

  /**
   * Stops the typing indicator in the channel.
   * The indicator will only stop if this is called as many times as startTyping().
   * <info>It can take a few seconds for the client user to stop typing.</info>
   * @param {boolean} [force=false] Whether or not to reset the call count and force the indicator to stop
   * @example
   * // Reduce the typing count by one and stop typing if it reached 0
   * channel.stopTyping();
   * @example
   * // Force typing to fully stop regardless of typing count
   * channel.stopTyping(true);
   */
  stopTyping(force = false) {
    if (this.client.user._typing.has(this.id)) {
      const entry = this.client.user._typing.get(this.id);
      entry.count--;
      if (entry.count <= 0 || force) {
        this.client.clearInterval(entry.interval);
        this.client.user._typing.delete(this.id);
        entry.resolve();
      }
    }
  }

  /**
   * Whether or not the typing indicator is being shown in the channel
   * @type {boolean}
   * @readonly
   */
  get typing() {
    return this.client.user._typing.has(this.id);
  }

  /**
   * Number of times `startTyping` has been called
   * @type {number}
   * @readonly
   */
  get typingCount() {
    if (this.client.user._typing.has(this.id)) return this.client.user._typing.get(this.id).count;
    return 0;
  }

  /**
   * Creates a Message Collector.
   * @param {CollectorFilter} filter The filter to create the collector with
   * @param {MessageCollectorOptions} [options={}] The options to pass to the collector
   * @returns {MessageCollector}
   * @example
   * // Create a message collector
   * const collector = channel.createMessageCollector(
   *   m => m.content.includes('discord'),
   *   { time: 15000 }
   * );
   * collector.on('collect', m => console.log(`Collected ${m.content}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageCollector(filter, options = {}) {
    return new MessageCollector(this, filter, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {MessageCollectorOptions} AwaitMessagesOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createMessageCollector but in promise form.
   * Resolves with a collection of messages that pass the specified filter.
   * @param {CollectorFilter} filter The filter function to use
   * @param {AwaitMessagesOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // Await !vote messages
   * const filter = m => m.content.startsWith('!vote');
   * // Errors: ['time'] treats ending because of the time limit as an error
   * channel.awaitMessages(filter, { max: 4, time: 60000, errors: ['time'] })
   *   .then(collected => console.log(collected.size))
   *   .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
   */
  awaitMessages(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createMessageCollector(filter, options);
      collector.once('end', (collection, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(collection);
        } else {
          resolve(collection);
        }
      });
    });
  }

  /**
   * Bulk deletes given messages that are newer than two weeks.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Collection<Snowflake, Message>|Message[]|Snowflake[]|number} messages
   * Messages or number of messages to delete
   * @param {boolean} [filterOld=false] Filter messages to remove those which are older than two weeks automatically
   * @returns {Promise<Collection<Snowflake, Message>>} Deleted messages
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
        await this.client.api.channels(this.id).messages(messageIDs[0]).delete();
        const message = this.client.actions.MessageDelete.handle({
          channel_id: this.id,
          id: messageIDs[0],
        }).message;
        if (message) return new Collection([[message.id, message]]);
        return new Collection();
      }
      await this.client.api.channels[this.id].messages['bulk-delete']
        .post({ data: { messages: messageIDs } });
      return this.client.actions.MessageDeleteBulk.handle({
        channel_id: this.id,
        ids: messageIDs,
      }).messages;
    }
    if (!isNaN(messages)) {
      const msgs = await this.messages.fetch({ limit: messages });
      return this.bulkDelete(msgs, filterOld);
    }
    throw new TypeError('MESSAGE_BULK_DELETE_TYPE');
  }

  /**
   * Marks all messages in this channel as read.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<TextChannel|GroupDMChannel|DMChannel>}
   */
  acknowledge() {
    if (!this.lastMessageID) return Promise.resolve(this);
    return this.client.api.channels[this.id].messages[this.lastMessageID].ack
      .post({ data: { token: this.client.rest._ackToken } })
      .then(res => {
        if (res.token) this.client.rest._ackToken = res.token;
        return this;
      });
  }

  static applyToClass(structure, full = false, ignore = []) {
    const props = ['send'];
    if (full) {
      props.push(
        'acknowledge',
        'search',
        'bulkDelete',
        'startTyping',
        'stopTyping',
        'typing',
        'typingCount',
        'createMessageCollector',
        'awaitMessages'
      );
    }
    for (const prop of props) {
      if (ignore.includes(prop)) continue;
      Object.defineProperty(structure.prototype, prop,
        Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop));
    }
  }
}

module.exports = TextBasedChannel;

// Fixes Circular
const MessageStore = require('../../stores/MessageStore');
