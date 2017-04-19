const AbstractHandler = require('./AbstractHandler');

class MessageReactionAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageReactionAdd.handle(data);
  }
}

module.exports = MessageReactionAddHandler;
