const Action = require('./Action');
const Collection = require('../../util/Collection');
const Constants = require('../../util/Constants');

class MessageDeleteBulkAction extends Action {
  handle(data) {
    const messages = new Collection();

    if (!data.messages) {
      const channel = this.client.channels.get(data.channel_id);
      for (const id of data.ids) {
        const message = channel.messages.get(id);
        if (message) messages.set(message.id, message);
      }
    } else {
      for (const msg of data.messages) {
        messages.set(msg.id, msg);
      }
    }

    if (messages.size > 0) this.client.emit(Constants.Events.MESSAGE_BULK_DELETE, messages);
    return { messages };
  }
}

module.exports = MessageDeleteBulkAction;
