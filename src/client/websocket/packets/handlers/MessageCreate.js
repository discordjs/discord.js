const AbstractHandler = require('./AbstractHandler');

class MessageCreateHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageCreate.handle(packet.d);
  }
}

module.exports = MessageCreateHandler;
