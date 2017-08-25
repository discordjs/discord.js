const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class MessageUpdateHandler extends AbstractHandler {
  handle(packet) {
    const { old, updated } = this.packetManager.client.actions.MessageUpdate.handle(packet.d);
    if (old && updated) {
      this.packetManager.client.emit(Constants.Events.MESSAGE_UPDATE, old, updated);
    }
  }
}

module.exports = MessageUpdateHandler;
