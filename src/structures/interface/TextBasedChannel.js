const path = require('path');
const EventEmitter = require('events').EventEmitter;
const Message = require('../Message');
const Collection = require('../../util/Collection');

/**
 * Interface for classes that have text-channel-like features
 * @interface
 */
class TextBasedChannel {
  constructor() {
    /**
     * A Collection containing the messages sent to this channel.
     * @type {Collection<string, Message>}
     */
    this.messages = new Collection();
  }

  /**
   * Bulk delete a given Collection or Array of messages in one go. Returns the deleted messages after.
   * @param {Collection<string, Message>|Message[]} messages The messages to delete
   * @returns {Collection<string, Message>}
   */
  bulkDelete(messages) {
    if (messages instanceof Collection) messages = messages.array();
    if (!(messages instanceof Array)) return Promise.reject(new TypeError('messages must be an array or collection'));
    const messageIDs = messages.map(m => m.id);
    return this.client.rest.methods.bulkDeleteMessages(this, messageIDs);
  }

  /**
   * Options that can be passed into sendMessage or sendTTSMessage:
   * ```js
   * {
   *   tts: false,
   *   nonce: '',
   * };
   * ```
   * @typedef {Object} MessageOptions
   */

  /**
   * Send a message to this channel
   * @param {string} content The content to send
   * @param {MessageOptions} [options={}] The options to provide
   * @returns {Promise<Message>}
   * @example
   * // send a message
   * channel.sendMessage('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.log);
   */
  sendMessage(content, options = {}) {
    return this.client.rest.methods.sendMessage(this, content, options.tts, options.nonce);
  }

  /**
   * Send a text-to-speech message to this channel
   * @param {string} content The content to send
   * @param {MessageOptions} [options={}] The options to provide
   * @returns {Promise<Message>}
   * @example
   * // send a TTS message
   * channel.sendTTSMessage('hello!')
   *  .then(message => console.log(`Sent tts message: ${message.content}`))
   *  .catch(console.log);
   */
  sendTTSMessage(content, options = {}) {
    return this.client.rest.methods.sendMessage(this, content, true, options.nonce);
  }

  /**
   * Send a file to this channel
   * @param {FileResolvable} attachment The file to send
   * @param {string} [fileName="file.jpg"] The name and extension of the file
   * @returns {Promise<Message>}
   */
  sendFile(attachment, fileName) {
    if (!fileName) {
      if (typeof attachment === 'string') {
        fileName = path.basename(attachment);
      } else if (attachment && attachment.path) {
        fileName = path.basename(attachment.path);
      } else {
        fileName = 'file.jpg';
      }
    }
    return new Promise((resolve, reject) => {
      this.client.resolver.resolveFile(attachment).then(file => {
        this.client.rest.methods.sendMessage(this, undefined, false, undefined, {
          file,
          name: fileName,
        }).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  /**
   * The parameters to pass in when requesting previous messages from a channel. `around`, `before` and
   * `after` are mutually exclusive. All the parameters are optional.
   * ```js
   * {
   *  limit: 30, // the message limit, defaults to 50
   *  before: '123', // gets messages before the given message ID
   *  after: '123', // gets messages after the given message ID
   *  around: '123', // gets messages around the given message ID
   * }
   * ```
   * @typedef {Object} ChannelLogsQueryOptions
   */

  /**
   * Gets the past messages sent in this channel. Resolves with a Collection mapping message ID's to Message objects.
   * @param {ChannelLogsQueryOptions} [options={}] The query parameters to pass in
   * @returns {Promise<Collection<string, Message>>}
   * @example
   * // get messages
   * channel.fetchMessages({limit: 10})
   *  .then(messages => console.log(`Received ${messages.size} messages`))
   *  .catch(console.log);
   */
  fetchMessages(options = {}) {
    return new Promise((resolve, reject) => {
      this.client.rest.methods.getChannelMessages(this, options).then(data => {
        const messages = new Collection();
        for (const message of data) {
          const msg = new Message(this, message, this.client);
          messages.set(message.id, msg);
          this._cacheMessage(msg);
        }
        resolve(messages);
      }).catch(reject);
    });
  }

  /**
   * Starts a typing indicator in the channel.
   * @param {number} [count] The number of times startTyping should be considered to have been called
   * @example
   * // start typing in a channel
   * channel.startTyping();
   */
  startTyping(count) {
    if (typeof count !== 'undefined' && count < 1) throw new RangeError('count must be at least 1');
    if (!this.client.user._typing.has(this.id)) {
      this.client.user._typing.set(this.id, {
        count: count || 1,
        interval: this.client.setInterval(() => {
          this.client.rest.methods.sendTyping(this.id);
        }, 4000),
      });
      this.client.rest.methods.sendTyping(this.id);
    } else {
      const entry = this.client.user._typing.get(this.id);
      entry.count = count || entry.count + 1;
    }
  }

  /**
   * Stops the typing indicator in the channel.
   * The indicator will only stop if this is called as many times as startTyping().
   * <info>It can take a few seconds for the Client User to stop typing.</info>
   * @param {boolean} [force=false] Whether or not to reset the call count and force the indicator to stop
   * @example
   * // stop typing in a channel
   * channel.stopTyping();
   * @example
   * // force typing to fully stop in a channel
   * channel.stopTyping(true);
   */
  stopTyping(force = false) {
    if (this.client.user._typing.has(this.id)) {
      const entry = this.client.user._typing.get(this.id);
      entry.count--;
      if (entry.count <= 0 || force) {
        clearInterval(entry.interval);
        this.client.user._typing.delete(this.id);
      }
    }
  }

  /**
   * Whether or not the typing indicator is being shown in the channel.
   * @type {boolean}
   */
  get typing() {
    return this.client.user._typing.has(this.id);
  }

  /**
   * Number of times `startTyping` has been called.
   * @type {number}
   */
  get typingCount() {
    if (this.client.user._typing.has(this.id)) return this.client.user._typing.get(this.id).count;
    return 0;
  }

  /**
   * Creates a Message Collector
   * @param {CollectorFilterFunction} filter The filter to create the collector with
   * @param {CollectorOptions} [options={}] The options to pass to the collector
   * @returns {MessageCollector}
   * @example
   * // create a message collector
   * const collector = channel.createCollector(
   *  m => m.content.includes('discord'),
   *  { time: 15000 }
   * );
   * collector.on('message', m => console.log(`Collected ${m.content}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createCollector(filter, options = {}) {
    return new MessageCollector(this, filter, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * ```js
   * {
   *  errors: [], // an array of stop/end reasons that cause the promise to reject.
   * }
   * ```
   * @typedef {Object} AwaitMessagesOptions
   */

  /**
   * Similar to createCollector but in Promise form. Resolves with a Collection of messages that pass the specified
   * filter.
   * @param {CollectorFilterFunction} filter The filter function to use
   * @param {AwaitMessagesOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<string, Message>>}
   * @example
   * // await !vote messages
   * const filter = m => m.content.startsWith('!vote');
   * // errors: ['time'] treats ending because of the time limit as an error
   * channel.awaitMessages(filter, { max: 4, time: 60000, errors: ['time'] })
   *  .then(collected => console.log(collected.size))
   *  .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
   */
  awaitMessages(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createCollector(filter, options);
      collector.on('end', (collection, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(collection);
        } else {
          resolve(collection);
        }
      });
    });
  }

  _cacheMessage(message) {
    const maxSize = this.client.options.max_message_cache;
    if (maxSize === 0) return null;
    if (this.messages.size >= maxSize) this.messages.delete(this.messages.keys().next().value);

    this.messages.set(message.id, message);
    return message;
  }

  /**
   * Fetches the pinned messages of this Channel and returns a Collection of them.
   * @returns {Promise<Collection<string, Message>>}
   */
  fetchPinnedMessages() {
    return new Promise((resolve, reject) => {
      this.client.rest.methods.getChannelPinnedMessages(this).then(data => {
        const messages = new Collection();
        for (const message of data) {
          const msg = new Message(this, message, this.client);
          messages.set(message.id, msg);
          this._cacheMessage(msg);
        }
        resolve(messages);
      }).catch(reject);
    });
  }
}

/**
 * Collects messages based on a specified filter, then emits them.
 * @extends {EventEmitter}
 */
class MessageCollector extends EventEmitter {
  /**
   * A function that takes a Message object and a MessageCollector and returns a boolean.
   * ```js
   * function(message, collector) {
   *  if (message.content.includes('discord')) {
   *    return true; // passed the filter test
   *  }
   *  return false; // failed the filter test
   * }
   * ```
   * @typedef {function} CollectorFilterFunction
   */

  /**
   * An object containing options used to configure a MessageCollector. All properties are optional.
   * ```js
   * {
   *  time: null, // time in milliseconds. If specified, the collector ends after this amount of time.
   *  max: null, // the maximum amount of messages to handle before ending.
   * }
   * ```
   * @typedef {Object} CollectorOptions
   */

  /**
   * @param {Channel} channel The channel to collect messages in
   * @param {CollectorFilterFunction} filter The filter function
   * @param {CollectorOptions} [options] Options for the collector
   */
  constructor(channel, filter, options = {}) {
    super();
    /**
     * The channel this collector is operating on
     * @type {Channel}
     */
    this.channel = channel;
    /**
     * A function used to filter messages that the collector collects.
     * @type {CollectorFilterFunction}
     */
    this.filter = filter;
    /**
     * Options for the collecor.
     * @type {CollectorOptions}
     */
    this.options = options;
    /**
     * Whether this collector has stopped collecting Messages.
     * @type {boolean}
     */
    this.ended = false;
    this.listener = message => this.verify(message);
    this.channel.client.on('message', this.listener);
    /**
     * A collection of collected messages, mapped by message ID.
     * @type {Collection<string, Message>}
     */
    this.collected = new Collection();
    if (options.time) this.channel.client.setTimeout(() => this.stop('time'), options.time);
  }

  /**
   * Verifies a message against the filter and options
   * @private
   * @param {Message} message The message
   * @returns {boolean}
   */
  verify(message) {
    if (this.channel ? this.channel.id !== message.channel.id : false) return false;
    if (this.filter(message, this)) {
      this.collected.set(message.id, message);
      /**
       * Emitted whenever the Collector receives a Message that passes the filter test.
       * @param {Message} message The received message
       * @param {MessageCollector} collector The collector the message passed through
       * @event MessageCollector#message
       */
      this.emit('message', message, this);
      if (this.options.max && this.collected.size === this.options.max) this.stop('limit');
      return true;
    }
    return false;
  }

  /**
   * Stops the collector and emits `end`.
   * @param {string} [reason='user'] An optional reason for stopping the collector
   */
  stop(reason = 'user') {
    if (this.ended) return;
    this.ended = true;
    this.channel.client.removeListener('message', this.listener);
    /**
     * Emitted when the Collector stops collecting.
     * @param {Collection<string, Message>} collection A collection of messages collected
     * during the lifetime of the Collector, mapped by the ID of the Messages.
     * @param {string} reason The reason for the end of the collector. If it ended because it reached the specified time
     * limit, this would be `time`. If you invoke `.stop()` without specifying a reason, this would be `user`. If it
     * ended because it reached its message limit, it will be `limit`.
     * @event MessageCollector#end
     */
    this.emit('end', this.collected, reason);
  }
}

exports.applyToClass = (structure, full = false) => {
  const props = ['sendMessage', 'sendTTSMessage', 'sendFile'];
  if (full) {
    props.push('_cacheMessage');
    props.push('fetchMessages');
    props.push('bulkDelete');
    props.push('startTyping');
    props.push('stopTyping');
    props.push('typing');
    props.push('typingCount');
    props.push('fetchPinnedMessages');
    props.push('createCollector');
    props.push('awaitMessages');
  }
  for (const prop of props) applyProp(structure, prop);
};

function applyProp(structure, prop) {
  Object.defineProperty(structure.prototype, prop, Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop));
}
