const AbstractHandler = require('./AbstractHandler');

class MessageUpdateHandler extends AbstractHandler {
  handle(packet) {
    const { old, updated } = this.packetManager.client.actions.MessageUpdate.handle(packet.d);
    if (old && updated) {
      this.packetManager.client.emit(Events.MESSAGE_UPDATE, old, updated);
    }
  }
}

module.exports = MessageUpdateHandler;

const { Constants: { Events } } = require('../../../../');

/**
 * Emitted whenever a message is updated - e.g. embed or content change.
 * @event Client#messageUpdate
 * @param {Message} oldMessage The message before the update
 * @param {Message} newMessage The message after the update
 */
