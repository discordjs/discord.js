const Action = require('./Action');
const Constants = require('../../util/Constants');
const cloneObject = require('../../util/CloneObject');

class MessageUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const message = channel.messages.get(data.id);
      if (message && !message.equals(data, true)) {
        const oldMessage = cloneObject(message);
        message.patch(data);
        client.emit(Constants.Events.MESSAGE_UPDATE, oldMessage, message);
        return {
          old: oldMessage,
          updated: message,
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
