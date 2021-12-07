'use strict';

const { Collection } = require('@discordjs/collection');
const Action = require('./Action');
const { deletedMessages } = require('../../structures/Message');
const { Events } = require('../../util/Constants');

class MessageDeleteBulkAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.channel_id);

    if (channel) {
      if (!channel.isText()) return {};

      const ids = data.ids;
      const messages = new Collection();
      for (const id of ids) {
        const message = this.getMessage(
          {
            id,
            guild_id: data.guild_id,
          },
          channel,
          false,
        );
        if (message) {
          deletedMessages.add(message);
          messages.set(message.id, message);
          channel.messages.cache.delete(id);
        }
      }

      /**
       * Emitted whenever messages are deleted in bulk.
       * @event Client#messageDeleteBulk
       * @param {Collection<Snowflake, Message>} messages The deleted messages, mapped by their id
       */
      if (messages.size > 0) client.emit(Events.MESSAGE_BULK_DELETE, messages);
      return { messages };
    }
    return {};
  }
}

module.exports = MessageDeleteBulkAction;
