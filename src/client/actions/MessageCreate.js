const Action = require('./Action');
const Constants = require('../../util/Constants');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);
    const user = client.users.get(data.author.id);
    if (channel) {
      const existing = channel.messages.get(data.id);
      if (existing) return { message: existing };
      const member = channel.guild ? channel.guild.member(user) : null;
      const message = channel.messages.create(data);
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

      client.emit(Constants.Events.MESSAGE_CREATE, message);
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
