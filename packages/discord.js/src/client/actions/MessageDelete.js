'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class MessageDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = this.getChannel({ id: data.channel_id, ...('guild_id' in data && { guild_id: data.guild_id }) });
    let message;
    if (channel) {
      if (!channel.isTextBased()) return {};

      if (channel.isThread()) channel.messageCount--;

      message = this.getMessage(data, channel);
      if (message) {
        channel.messages.cache.delete(message.id);
        /**
         * Emitted whenever a message is deleted.
         * @event Client#messageDelete
         * @param {Message} message The deleted message
         */
        client.emit(Events.MessageDelete, message);
      }
    }

    return { message };
  }
}

module.exports = MessageDeleteAction;
