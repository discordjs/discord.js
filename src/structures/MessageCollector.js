const Collector = require('./interfaces/Collector');

/**
 * Collects messages on a channel.
 * @fires MessageCollector#message
 * @implements {Collector}
 */
class MessageCollector extends Collector {

  /**
   * @param {TextBasedChannel} channel The channel.
   * @param {CollectorFilter} filter The filter to be applied to this collector.
   * @param {CollectorOptions} options The options to be applied to this collector.
   */
  constructor(channel, filter, options = {}) {
    super(channel.client, filter, options);

    /**
     * @type {TextBasedChannel} channel The channel.
     */
    this.channel = channel;

    // For backwards compatibility
    this._reEmitter = message => {
      /**
       * Emitted when the collector receives a message.
       * @event MessageCollector#message
       * @param {Message} message The message.
       */
      this.emit('message', message);
    };
    this.on('collect', this._reEmitter);

    this.client.on('message', this.listener);
  }

  handle(message) {
    if (message.channel.id !== this.channel.id) return null;
    return {
      key: message.id,
      value: message,
    };
  }

  postCheck() {
    if (this.collected.size >= this.options.max) return 'limit';
    return null;
  }

  cleanup() {
    this.removeListener('collect', this._reEmitter);
    this.client.removeListener('message', this.listener);
  }
}

module.exports = MessageCollector;
