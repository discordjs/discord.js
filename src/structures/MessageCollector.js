const Collector = require('./interfaces/Collector');
const util = require('util');

/**
 * @typedef {CollectorOptions} MessageCollectorOptions
 * @property {number} max The maximum amount of messages to process
 * @property {number} maxMatches The maximum amount of messages to collect
 */

/**
 * Collects messages on a channel.
 * @extends {Collector}
 */
class MessageCollector extends Collector {
  /**
   * @param {TextChannel|DMChannel|GroupDMChannel} channel The channel
   * @param {CollectorFilter} filter The filter to be applied to this collector
   * @param {MessageCollectorOptions} options The options to be applied to this collector
   * @emits MessageCollector#message
   */
  constructor(channel, filter, options = {}) {
    super(channel.client, filter, options);

    /**
     * The channel
     * @type {TextBasedChannel}
     */
    this.channel = channel;

    /**
     * Total number of messages that were received in the channel during message collection
     * @type {number}
     */
    this.received = 0;

    this.client.setMaxListeners(this.client.getMaxListeners() + 1);
    this.client.on('message', this.listener);

    // For backwards compatibility (remove in v12)
    if (this.options.max) this.options.maxProcessed = this.options.max;
    if (this.options.maxMatches) this.options.max = this.options.maxMatches;
    this._reEmitter = message => {
      /**
       * Emitted when the collector receives a message.
       * @event MessageCollector#message
       * @param {Message} message The message
       * @deprecated
       */
      this.emit('message', message);
    };
    this.on('collect', this._reEmitter);
  }

  // Remove in v12
  on(eventName, listener) {
    if (eventName === 'message') {
      listener = util.deprecate(listener, 'MessageCollector will soon no longer emit "message", use "collect" instead');
    }
    super.on(eventName, listener);
  }

  /**
   * Handle an incoming message for possible collection.
   * @param {Message} message The message that could be collected
   * @returns {?{key: Snowflake, value: Message}}
   * @private
   */
  handle(message) {
    if (message.channel.id !== this.channel.id) return null;
    this.received++;
    return {
      key: message.id,
      value: message,
    };
  }

  /**
   * Check after collection to see if the collector is done.
   * @returns {?string} Reason to end the collector, if any
   * @private
   */
  postCheck() {
    // Consider changing the end reasons for v12
    if (this.options.maxMatches && this.collected.size >= this.options.max) return 'matchesLimit';
    if (this.options.max && this.received >= this.options.maxProcessed) return 'limit';
    return null;
  }

  /**
   * Removes event listeners.
   * @private
   */
  cleanup() {
    this.removeListener('collect', this._reEmitter);
    this.client.removeListener('message', this.listener);
    this.client.setMaxListeners(this.client.getMaxListeners() - 1);
  }
}

module.exports = MessageCollector;
