const Action = require('./Action');
const Message = require('../../structures/Message');

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get((data instanceof Array ? data[0] : data).channel_id);
    if (channel) {
      if (data instanceof Array) {
        const messages = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
          messages[i] = channel._cacheMessage(new Message(channel, data[i], client));
        }
        return {
          messages,
        };
      } else {
        const message = channel._cacheMessage(new Message(channel, data, client));
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
