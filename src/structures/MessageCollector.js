const Collector = require('./interfaces/Collector');
const { Events } = require('../util/Constants');

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
     * The channel
     * @type {TextBasedChannel}
     */
    this.channel = channel;

    /**
     * Total number of messages that were received in the channel during message collection
     * @type {number}
     */
    this.received = 0;

    const bulkDeleteListener = (messages => {
      for (const message of messages.values()) this.handleDispose(message);
    }).bind(this);

    this.client.on(Events.MESSAGE_CREATE, this.handleCollect);
    this.client.on(Events.MESSAGE_DELETE, this.handleDispose);
    this.client.on(Events.MESSAGE_BULK_DELETE, bulkDeleteListener);

    this.once('end', () => {
      this.client.removeListener(Events.MESSAGE_CREATE, this.handleCollect);
      this.client.removeListener(Events.MESSAGE_DELETE, this.handleDispose);
      this.client.removeListener(Events.MESSAGE_BULK_DELETE, bulkDeleteListener);
    });
  }

  /**
   * Handle a message for possible collection.
   * @param {Message} message The message that could be collected
   * @returns {?{key: Snowflake, value: Message}}
   * @private
   */
  collect(message) {
    if (message.channel.id !== this.channel.id) return null;
    this.received++;
    return {
      key: message.id,
      value: message,
    };
  }

  /**
   * Handle a message for possible disposal.
   * @param {Message} message The message that could be disposed
   * @returns {?string}
   */
  dispose(message) {
    return message.channel.id === this.channel.id ? message.id : null;
  }

  /**
   * Check after un/collection to see if the collector is done.
   * @returns {?string}
   * @private
   */
  endReason() {
    if (this.options.max && this.collected.size >= this.options.max) return 'limit';
    if (this.options.maxProcessed && this.received === this.options.maxProcessed) return 'processedLimit';
    return null;
  }
}

module.exports = MessageCollector;
