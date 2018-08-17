const Action = require('./Action');

class MessageUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const message = channel.messages.get(data.id);
      if (message) {
        message.patch(data);
        return {
          old: message._edits[0],
          updated: message,
        };
      }
    }

    return {};
  }

  _patch(data) {
    data.channel_id = BigInt(data.channel_id);
    data.id = BigInt(data.id);
  }
}

module.exports = MessageUpdateAction;
