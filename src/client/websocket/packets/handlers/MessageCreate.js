const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class MessageCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const response = client.actions.MessageCreate.handle(data);
    if (response.message) client.emit(Constants.Events.MESSAGE_CREATE, response.message);
  }
}

/**
 * Emitted whenever a message is created
 * @event Client#message
 * @param {Message} message The created message
 */

module.exports = MessageCreateHandler;
