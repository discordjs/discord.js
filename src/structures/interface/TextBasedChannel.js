const Collection = require('../../util/Collection');
const Message = require('../Message');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

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
 * @typedef {Function} CollectorFilterFunction
 */

/**
 * An object containing options used to configure a MessageCollector. All properties are optional.
 * ```js
 * {
 *  time: null, // time in milliseconds. If specified, the collector ends after this amount of time.
 *  allowSelf: false, // whether or not the filter should take messages from the logged in client.
 *  max: null, // the maximum amount of messages to handle before ending.
 * }
 * ```
 * @typedef {Object} CollectorOptions
 */

/**
 * Collects messages based on a specified filter, then emits them.
 * @extends {EventEmitter}
 */
class MessageCollector extends EventEmitter {
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
     * @type {Boolean}
     */
    this.ended = false;
    this.listener = (message => this.verify(message));
    this.channel.client.on('message', this.listener);
    /**
     * A collection of collected messages, mapped by message ID.
     * @type {Collection<String, Message>}
     */
    this.collected = new Collection();
    if (options.time) {
      this.channel.client.setTimeout(() => this.stop('time'), options.time);
    }
  }

  /**
   * Verifies a message against the filter and options
   * @private
   * @param {Message} message
   * @returns {Boolean}
   */
  verify(message) {
    if (this.channel ? this.channel.id !== message.channel.id : false) {
      return false;
    }
    if (message.author.id === this.channel.client.user.id && !this.options.allowSelf) {
      return false;
    }
    if (this.filter(message, this)) {
      this.collected.set(message.id, message);
      /**
       * Emitted whenever the Collector receives a Message that passes the filter test.
       * @param {Message} message the received message
       * @param {MessageCollector} collector the collector the message passed through.
       * @event MessageCollector#message
       */
      this.emit('message', message, this);
      if (this.options.max && this.collected.size === this.options.max) {
        this.stop('limit');
      }
      return true;
    }
    return false;
  }

  /**
   * Stops the collector and emits `end`.
   * @param {string} [reason='user'] an optional reason for stopping the collector.
   */
  stop(reason = 'user') {
    if (this.ended) {
      return;
    }
    this.ended = true;
    this.channel.client.removeListener('message', this.listener);
    /**
     * Emitted when the Collector stops collecting.
     * @param {Collection<String, Message>} collection A collection of messages collected
     * during the lifetime of the Collector.
     * Mapped by the ID of the Messages.
     * @param {String} reason The reason for the end of the collector. If it ended because it reached the specified time
     * limit, this would be `time`. If you invoke `.stop()` without specifying a reason, this would be `user`. If it
     * ended because it reached its message limit, it will be `limit`.
     * @event MessageCollector#end
     */
    this.emit('end', this.collected, reason);
  }
}

/**
 * Interface for classes that have text-channel-like features
 * @interface
 */
class TextBasedChannel {

  constructor() {
    /**
     * A Collection containing the messages sent to this channel.
     * @type {Collection<String, Message>}
     */
    this.messages = new Collection();
  }

  /**
   * Bulk delete a given Collection or Array of messages in one go. Returns the deleted messages after.
   * @param {Map<String, Message>|Array<Message>} messages the messages to delete
   * @returns {Collection<String, Message>}
   */
  bulkDelete(messages) {
    if (messages instanceof Map) {
      messages = messages.array();
    }
    if (!(messages instanceof Array)) {
      return Promise.reject('pass an array or map');
    }
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
   * @param {String} content the content to send
   * @param {MessageOptions} [options={}] the options to provide
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
   * @param {String} content the content to send
   * @param {MessageOptions} [options={}] the options to provide
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
   * @param {String} [fileName="file.jpg"] The name and extension of the file
   * @returns {Promise<Message>}
   */
  sendFile(attachment, fileName) {
    if (!fileName) {
      if (attachment instanceof String || typeof attachment === 'string') {
        fileName = path.basename(attachment);
      } else if (attachment && attachment.path) {
        fileName = path.basename(attachment.path);
      } else {
        fileName = 'file.jpg';
      }
    }
    return new Promise((resolve, reject) => {
      this.client.resolver.resolveFile(attachment)
      .then(file => {
        this.client.rest.methods.sendMessage(this, undefined, false, undefined, {
          file,
          name: fileName,
        }).then(resolve).catch(reject);
      })
      .catch(reject);
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
   * @param {ChannelLogsQueryOptions} [options={}] the query parameters to pass in
   * @returns {Promise<Collection<String, Message>, Error>}
   * @example
   * // get messages
   * channel.fetchMessages({limit: 10})
   *  .then(messages => console.log(`Received ${messages.size} messages`))
   *  .catch(console.log);
   */
  fetchMessages(options = {}) {
    return new Promise((resolve, reject) => {
      this.client.rest.methods.getChannelMessages(this, options)
        .then(data => {
          const messages = new Collection();
          for (const message of data) {
            const msg = new Message(this, message, this.client);
            messages.set(message.id, msg);
            this._cacheMessage(msg);
          }
          resolve(messages);
        })
        .catch(reject);
    });
  }

  /**
   * Starts a typing indicator in the channel.
   * @param {Number} [count] The number of times startTyping should be considered to have been called
   * @returns {null}
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
   * @param {Boolean} [force] whether or not to force the indicator to stop regardless of call count
   * @returns {null}
   * @example
   * // stop typing in a channel
   * channel.stopTyping();
   * @example
   * // force typing to fully stop in a channel
   * channel.stopTyping(true);
   */
  stopTyping(force) {
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
   * @type {Boolean}
   */
  get typing() {
    return this.client.user._typing.has(this.id);
  }

  /**
   * Number of times `startTyping` has been called.
   * @type {Number}
   */
  get typingCount() {
    if (this.client.user._typing.has(this.id)) return this.client.user._typing.get(this.id).count;
    return 0;
  }

  /**
   * Creates a Message Collector
   * @param {CollectorFilterFunction} filter the filter to create the collector with
   * @param {CollectorOptions} [options={}] the options to pass to the collector
   * @returns {MessageCollector}
   */
  createCollector(filter, options = {}) {
    const collector = new MessageCollector(this, filter, options);
    return collector;
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
   * @param {CollectorFilterFunction} filter the filter function to use
   * @param {AwaitMessagesOptions} [options={}] optional options to pass to the internal collector
   * @returns {Promise<Collection<String, Message>>}
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
    if (maxSize === 0) {
      // saves on performance
      return null;
    }

    if (this.messages.size >= maxSize) {
      this.messages.delete(this.messages.keys().next().value);
    }

    this.messages.set(message.id, message);

    return message;
  }

  /**
   * Fetches the pinned messages of this Channel and returns a Collection of them.
   * @returns {Promise<Collection<String, Message>, Error>}
   */
  fetchPinnedMessages() {
    return new Promise((resolve, reject) => {
      this.client.rest.methods.getChannelPinnedMessages(this)
        .then(data => {
          const messages = new Collection();
          for (const message of data) {
            const msg = new Message(this, message, this.client);
            messages.set(message.id, msg);
            this._cacheMessage(msg);
          }
          resolve(messages);
        })
        .catch(reject);
    });
  }
}

function applyProp(structure, prop) {
  structure.prototype[prop] = TextBasedChannel.prototype[prop];
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
  for (const prop of props) {
    applyProp(structure, prop);
  }
};
