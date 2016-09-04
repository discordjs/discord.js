const Action = require('./Action');
const Message = require('../../structures/Message');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const message = channel._cacheMessage(new Message(channel, data, client));
      return {
        message,
      };
    }

    return {
      message: null,
    };
  }
}

module.exports = MessageCreateAction;
