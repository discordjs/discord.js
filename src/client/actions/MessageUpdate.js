'use strict';

const Action = require('./Action');

class MessageUpdateAction extends Action {
  handle(data) {
    const channel = this.getChannel(data);
    if (channel) {
      const message = this.getMessage(data, channel);
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
