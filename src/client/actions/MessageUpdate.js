const Action = require('./Action');
const Constants = require('../../util/Constants');
const Message = require('../../structures/Message');

class MessageUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const message = channel.messages.get(data.id);
      if (message) {
        const newMessage = new Message(message.channel, data, client);
        newMessage._edits.push(...message._edits);
        newMessage._edits.unshift(message);
        channel.messages.set(data.id, newMessage);
        client.emit(Constants.Events.MESSAGE_UPDATE, message, newMessage);
        return {
          old: message,
          updated: newMessage,
        };
      }

      return {
        old: message,
        updated: message,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a message is updated - e.g. embed or content change.
 * @event Client#messageUpdate
 * @param {Message} oldMessage The message before the update.
 * @param {Message} newMessage The message after the update.
 */

module.exports = MessageUpdateAction;
