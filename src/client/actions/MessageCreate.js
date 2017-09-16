const Action = require('./Action');
const { Events } = require('../../util/Constants');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const existing = channel.messages.get(data.id);
      if (existing) return { message: existing };
      const message = channel.messages.create(data);
      const user = message.author;
      const member = channel.guild ? channel.guild.member(user) : null;
      channel.lastMessageID = data.id;
      channel.lastMessage = message;
      if (user) {
        user.lastMessageID = data.id;
        user.lastMessage = message;
      }
      if (member) {
        member.lastMessageID = data.id;
        member.lastMessage = message;
      }

      client.emit(Events.MESSAGE_CREATE, message);
      return { message };
    }

    return {};
  }
}

/**
 * Emitted whenever a message is created.
 * @event Client#message
 * @param {Message} message The created message
 */

module.exports = MessageCreateAction;
