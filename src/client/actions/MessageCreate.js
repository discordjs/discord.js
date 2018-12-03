'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const existing = channel.messages.get(data.id);
      if (existing) return { message: existing };
      const message = channel.messages.add(data);
      const user = message.author;
      let member = null;
      if (message.member && channel.guild) member = channel.guild.members.add(message.member);
      else if (channel.guild) member = channel.guild.member(user);
      channel.lastMessageID = data.id;
      if (user) {
        user.lastMessageID = data.id;
        user.lastMessageChannelID = channel.id;
      }
      if (member) {
        member.lastMessageID = data.id;
        member.lastMessageChannelID = channel.id;
      }

      /**
       * Emitted whenever a message is created.
       * @event Client#message
       * @param {Message} message The created message
       */
      client.emit(Events.MESSAGE_CREATE, message);
      return { message };
    }

    return {};
  }
}


module.exports = MessageCreateAction;
