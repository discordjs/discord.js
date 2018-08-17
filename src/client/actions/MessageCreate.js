const Action = require('./Action');
const { Events } = require('../../util/Constants');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const existing = channel.messages.get(data.id);
      if (existing) return { message: existing };
      const message = channel.messages.add(data);
      const user = message.author;
      const member = channel.guild ? channel.guild.member(user) : null;
      channel.lastMessageID = data.id;
      if (user) {
        user.lastMessageID = data.id;
        user.lastMessageChannelID = channel.id;
      }
      if (member) {
        member.lastMessageID = data.id;
        member.lastMessageChannelID = channel.id;
      }

      client.emit(Events.MESSAGE_CREATE, message);
      return { message };
    }

    return {};
  }

  _patch(data) {
    data.channel_id = BigInt(data.channel_id);
    data.id = BigInt(data.id);
    data.author.id = BigInt(data.author.id);
  }
}

/**
 * Emitted whenever a message is created.
 * @event Client#message
 * @param {Message} message The created message
 */

module.exports = MessageCreateAction;
