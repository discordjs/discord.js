const AbstractHandler = require('./AbstractHandler');

class MessageUpdateHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.actions.MessageUpdate.handle(data);
  }

}

module.exports = MessageUpdateHandler;
