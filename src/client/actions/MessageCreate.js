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
        channel.lastMessageID = messages[messages.length - 1].id;
        if (user) user.lastMessageID = messages[messages.length - 1].id;
        if (member) member.lastMessageID = messages[messages.length - 1].id;
        return {
          messages,
        };
      } else {
        const message = channel._cacheMessage(new Message(channel, data, client));
        channel.lastMessageID = data.id;
        if (user) user.lastMessageID = data.id;
        if (member) member.lastMessageID = data.id;
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
