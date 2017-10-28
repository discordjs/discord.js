import Action from './Action';
import Collection from '../../util/Collection';
import { Events } from '../../util/Constants';

class MessageDeleteBulkAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);

    if (channel) {
      const ids = data.ids;
      const messages = new Collection();
      for (const id of ids) {
        const message = channel.messages.get(id);
        if (message) {
          messages.set(message.id, message);
          channel.messages.delete(id);
        }
      }

      if (messages.size > 0) client.emit(Events.MESSAGE_BULK_DELETE, messages);
      return { messages };
    }
    return {};
  }
}

/**
 * Emitted whenever messages are deleted in bulk.
 * @event Client#messageDeleteBulk
 * @param {Collection<Snowflake, Message>} messages The deleted messages, mapped by their ID
 */

export default MessageDeleteBulkAction;
