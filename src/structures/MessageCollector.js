const Collector = require('./interfaces/Collector');

/**
 * @typedef {CollectorOptions} MessageCollectorOptions
 * @property {number} max The maximum amount of messages to collect
 * @property {number} maxProcessed The maximum amount of messages to process
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
     * @type {TextBasedChannel} channel The channel
     */
    this.channel = channel;

    /**
     * Total number of messages that were received in the channel during message collection
     * @type {number}
     */
    this.received = 0;

    this.client.on('message', this.listener);
  }

  /**
   * Handle an incoming message for possible collection.
   * @param {Message} message The message that could be collected
   * @returns {?{key: Snowflake, value: Message}} Message data to collect
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
    if (this.options.max && this.collected.size >= this.options.max) return 'limit';
    if (this.options.maxProcessed && this.received === this.options.maxProcessed) return 'processedLimit';
    return null;
  }

  /**
   * Removes event listeners.
   * @private
   */
  cleanup() {
    this.client.removeListener('message', this.listener);
  }
}

module.exports = MessageCollector;
