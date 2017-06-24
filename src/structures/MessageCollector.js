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

    /**
     * The bulk message delete listener.
     * @type {Function}
     * @param {Collection<Snowflake, Message>} messages The deleted messages
     * @private
     */
    this._bulkDeleteListener = (messages => {
      for (const message of messages.values()) this.uncollect(message);
    }).bind(this);

    this.client.on('message', this.collect);
    this.client.on('messageDelete', this.uncollect);
    this.client.on('messageDeleteBulk', this._bulkDeleteListener);
  }

  /**
   * Handle a message for possible collection.
   * @param {Message} message The message that could be collected
   * @returns {?{key: Snowflake, value: Message}} Message data to collect
   * @private
   */
  shouldCollect(message) {
    if (message.channel.id !== this.channel.id) return null;
    this.received++;
    return {
      key: message.id,
      value: message,
    };
  }

  /**
   * Handle a message for possible uncollection.
   * @param {Message} message The message that could be uncollected
   * @returns {?string} The message ID.
   */
  shouldUncollect(message) {
    return message.channel.id === this.channel.id ? message.id : null;
  }

  /**
   * Check after un/collection to see if the collector is done.
   * @returns {?string} Reason to end the collector, if any
   * @private
   */
  shouldEnd() {
    if (this.options.max && this.collected.size >= this.options.max) return 'limit';
    if (this.options.maxProcessed && this.received === this.options.maxProcessed) return 'processedLimit';
    return null;
  }

  /**
   * Removes event listeners.
   * @private
   */
  cleanup() {
    this.client.removeListener('message', this.collect);
    this.client.removeListener('messageDelete', this.uncollect);
    this.client.removeListener('messageDeleteBulk', this._bulkDeleteListener);
  }
}

module.exports = MessageCollector;
