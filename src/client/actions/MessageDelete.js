const Action = require('./Action');

class MessageDeleteAction extends Action {

  constructor(client) {
    super(client);
    this.timeouts = [];
    this.deleted = {};
  }

  handle(data) {
    const client = this.client;
    const channel = client.store.get('channels', data.channel_id);
    if (channel) {
      let message = channel.store.get('messages', data.id);

      if (message) {
        channel.store.remove('messages', message.id);
        this.deleted[channel.id + message.id] = message;
        this.scheduleForDeletion(channel.id, message.id);
      } else if (this.deleted[channel.id + data.id]) {
        message = this.deleted[channel.id + data.id];
      }

      return {
        m: message,
      };
    }

    return {
      m: null,
    };
  }

  scheduleForDeletion(channelID, messageID) {
    this.timeouts.push(
      setTimeout(() => delete this.deleted[channelID + messageID],
        this.client.options.rest_ws_bridge_timeout)
    );
  }
}

module.exports = MessageDeleteAction;
