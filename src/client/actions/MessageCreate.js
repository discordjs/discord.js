const Action = require('./Action');
const Message = require('../../structures/Message');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get((data instanceof Array ? data[0] : data).channel_id);
    const user = client.users.get((data instanceof Array ? data[0] : data).author.id);
    if (channel) {
      const member = channel.guild ? channel.guild.member(user) : null;
      if (data instanceof Array) {
        const messages = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
          messages[i] = channel._cacheMessage(new Message(channel, data[i], client));
        }
        const lastMessage = messages[messages.length - 1];
        channel.lastMessageID = lastMessage.id;
        if (user) {
          user.lastMessageID = lastMessage.id;
          user.lastMessage = lastMessage;
        }
        if (member) {
          member.lastMessageID = lastMessage.id;
          member.lastMessage = lastMessage;
        }
        return {
          messages,
        };
      } else {
        const message = channel._cacheMessage(new Message(channel, data, client));
        channel.lastMessageID = data.id;
        if (user) {
          user.lastMessageID = data.id;
          user.lastMessage = message;
        }
        if (member) {
          member.lastMessageID = data.id;
          member.lastMessage = message;
        }
        return {
          message,
        };
      }
    }

    return {
      message: null,
    };
  }
}

module.exports = MessageCreateAction;
