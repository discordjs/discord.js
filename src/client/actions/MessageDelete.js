const Action = require('./Action');
const { Events } = require('../../util/Constants');

class MessageDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);
    let message;

    if (channel) {
      message = channel.messages.get(data.id);
      if (message) {
        channel.messages.delete(message.id);
        client.emit(Events.MESSAGE_DELETE, message);
      }
    }

    return { message };
  }
}

/**
 * Emitted whenever a message is deleted.
 * @event Client#messageDelete
 * @param {Message} message The deleted message
 */

module.exports = MessageDeleteAction;
