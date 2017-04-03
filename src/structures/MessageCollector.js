const Collector = require('./interfaces/Collector');

class MessageCollector extends Collector {
  constructor(channel, filter, options = {}) {
    super(channel.client, filter, options);
    this.channel = channel;

    // For backwards compatibility
    this._reEmitter = message => this.emit('message', message);
    this.on('collect', this._reEmitter);

    this.client.on('message', this.listener);
  }

  handle(message) {
    if (message.channel.id !== this.channel.id) return null;
    return [message.id, message];
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
