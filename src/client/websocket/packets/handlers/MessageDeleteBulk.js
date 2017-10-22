const AbstractHandler = require('./AbstractHandler');

class MessageDeleteBulkHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageDeleteBulk.handle(packet.d);
  }
}

module.exports = MessageDeleteBulkHandler;
