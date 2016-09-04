const AbstractHandler = require('./AbstractHandler');

class MessageDeleteBulkHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageDeleteBulk.handle(data);
  }
}

/**
 * Emitted whenever messages are deleted in bulk
 * @event Client#messageDeleteBulk
 * @param {Collection<string, Message>} messages The deleted messages, mapped by their ID
 */

module.exports = MessageDeleteBulkHandler;
