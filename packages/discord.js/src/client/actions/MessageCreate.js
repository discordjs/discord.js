'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = this.getChannel({
      id: data.channel_id,
      author: data.author,
      ...('guild_id' in data && { guild_id: data.guild_id }),
    });
    if (channel) {
      if (!channel.isTextBased()) return {};

      if (channel.isThread()) {
        channel.messageCount++;
        channel.totalMessageSent++;
      }

      const existing = channel.messages.cache.get(data.id);
      if (existing && existing.author?.id !== this.client.user.id) return { message: existing };
      const message = existing ?? channel.messages._add(data);
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
