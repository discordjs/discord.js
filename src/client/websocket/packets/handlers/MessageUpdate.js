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

/**
 * Emitted whenever a message is updated - e.g. embed or content change.
 * @event Client#messageUpdate
 * @param {Message} oldMessage The message before the update
 * @param {Message} newMessage The message after the update
 */
