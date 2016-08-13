const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class MessageDeleteHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    const response = client.actions.MessageDelete.handle(data);

    if (response.m) {
      client.emit(Constants.Events.MESSAGE_DELETE, response.m);
    }
  }

}

module.exports = MessageDeleteHandler;
