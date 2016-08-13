const Action = require('./Action');
const Message = require('../../structures/Message');

class MessageCreateAction extends Action {

  handle(data) {
    const client = this.client;
    const channel = client.store.get('channels', data.channel_id);

    if (channel) {
      const message = channel._cacheMessage(new Message(channel, data, client));
      return {
        m: message,
      };
    }

    return {
      m: null,
    };
  }
}

module.exports = MessageCreateAction;
