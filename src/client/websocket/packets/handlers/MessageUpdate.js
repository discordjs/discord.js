const AbstractHandler = require('./AbstractHandler');

class MessageUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageUpdate.handle(data);
  }
}

module.exports = MessageUpdateHandler;
