const AbstractHandler = require('./AbstractHandler');

class MessageReactionRemoveEmoji extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageReactionRemoveEmoji.handle(data);
  }
}

module.exports = MessageReactionRemoveEmoji;
