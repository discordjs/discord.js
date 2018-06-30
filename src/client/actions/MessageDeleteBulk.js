const Action = require('./Action');
const Collection = require('../../util/Collection');
const Constants = require('../../util/Constants');

class MessageDeleteBulkAction extends Action {
  handle(data) {
    const messages = new Collection();
    const channel = this.client.channels.get(data.channel_id);

    if (channel) {
      for (const id of data.ids) {
        const message = channel.messages.get(id);
        if (message) {
          message.deleted = true;
          messages.set(message.id, message);
          channel.messages.delete(id);
        }
      }
    }

    if (messages.size > 0) this.client.emit(Constants.Events.MESSAGE_BULK_DELETE, messages);
    return { messages };
  }
}

module.exports = MessageDeleteBulkAction;
