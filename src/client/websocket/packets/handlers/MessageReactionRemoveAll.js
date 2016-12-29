const AbstractHandler = require('./AbstractHandler');

class MessageReactionRemoveAll extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageReactionRemoveAll.handle(data);
  }
}

module.exports = MessageReactionRemoveAll;
