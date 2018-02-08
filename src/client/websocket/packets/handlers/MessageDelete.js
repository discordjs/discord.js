const AbstractHandler = require('./AbstractHandler');

class MessageDeleteHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageDelete.handle(packet.d);
  }
}

module.exports = MessageDeleteHandler;
