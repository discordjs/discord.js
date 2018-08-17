const Action = require('./Action');
const Collection = require('../../util/Collection');
const { Events } = require('../../util/Constants');

class MessageDeleteBulkAction extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const channel = client.channels.get(data.channel_id);

    if (channel) {
      const ids = data.ids;
      const messages = new Collection();
      for (let id of ids) {
        id = BigInt(id);
        const message = channel.messages.get(id);
        if (message) {
          message.deleted = true;
          messages.set(message.id, message);
          channel.messages.delete(id);
        }
      }

      if (messages.size > 0) client.emit(Events.MESSAGE_BULK_DELETE, messages);
      return { messages };
    }
    return {};
  }

  _patch(data) {
    data.channel_id = BigInt(data.channel_id);
  }
}

/**
 * Emitted whenever messages are deleted in bulk.
 * @event Client#messageDeleteBulk
 * @param {Collection<Snowflake, Message>} messages The deleted messages, mapped by their ID
 */

module.exports = MessageDeleteBulkAction;
