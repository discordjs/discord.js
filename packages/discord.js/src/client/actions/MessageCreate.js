'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = this.getChannel(data);
    if (channel) {
      if (!channel.isTextBased()) return {};

      if (channel.isThread()) {
        channel.messageCount++;
        channel.totalMessageSent++;
      }

      const existing = channel.messages.cache.get(data.id);
      if (existing) return { message: existing };
      const message = channel.messages._add(data);
      channel.lastMessageId = data.id;

      /**
       * Emitted whenever a message is created.
       * @event Client#messageCreate
       * @param {Message} message The created message
       */
      client.emit(Events.MessageCreate, message);

      return { message };
    }

    return {};
  }
}

module.exports = MessageCreateAction;
