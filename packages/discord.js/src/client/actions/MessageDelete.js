'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class MessageDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = this.getChannel(data);
    let message;
    if (channel) {
      if (!channel.isTextBased()) return {};

      message = this.getMessage(data, channel);
      if ((message && message.embeds.length > 0) || message.content.length > 0) {
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
