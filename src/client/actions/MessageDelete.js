const Action = require('./Action');

class MessageDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);
    let message;

    if (channel) {
      message = channel.messages.get(data.id);
      if (message) {
        channel.messages.delete(message.id);
        this.deleted.set(channel.id + message.id, message);
        this.scheduleForDeletion(channel.id, message.id);
      } else {
        message = this.deleted.get(channel.id + data.id) || null;
      }
    }

    return { message };
  }

  scheduleForDeletion(channelID, messageID) {
    this.client.setTimeout(() => this.deleted.delete(channelID + messageID),
      this.client.options.restWsBridgeTimeout);
  }
}

module.exports = MessageDeleteAction;
