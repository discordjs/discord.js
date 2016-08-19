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

module.exports = MessageUpdateAction;
