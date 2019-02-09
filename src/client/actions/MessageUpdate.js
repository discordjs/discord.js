'use strict';

const Action = require('./Action');

class MessageUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.add({ ...data, id: data.channel_id });
    if (channel) {
      const message = channel.messages.add(data);
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
}

module.exports = MessageUpdateAction;
