const EventEmitter = require('events').EventEmitter;
const Collection = require('../util/Collection');

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
   * @typedef {Object} CollectorOptions
   * @property {number} [time] Duration for the collector in milliseconds
   * @property {number} [max] Maximum number of messages to handle
   * @property {number} [maxMatches] Maximum number of successfully filtered messages to obtain
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

    /**
     * A collection of collected messages, mapped by message ID.
     * @type {Collection<string, Message>}
     */
    this.collected = new Collection();

    this.listener = message => this.verify(message);
    this.channel.client.on('message', this.listener);
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
      if (this.collected.size >= this.options.maxMatches) this.stop('matchesLimit');
      else if (this.options.max && this.collected.size === this.options.max) this.stop('limit');
      return true;
    }
    return false;
  }

  /**
   * Returns a promise that resolves when a valid message is sent. Rejects
   * with collected messages if the Collector ends before receiving a message.
   * @type {Promise<Message>}
   * @readonly
   */
  get next() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('message', onMessage);
        this.removeListener('end', onEnd);
      };

      const onMessage = (...args) => {
        cleanup();
        resolve(...args);
      };

      const onEnd = (...args) => {
        cleanup();
        reject(...args);
      };

      this.once('message', onMessage);
      this.once('end', onEnd);
    });
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

module.exports = MessageCollector;
