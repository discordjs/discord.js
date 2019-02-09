'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class MessageDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.add({ ...data, id: data.channel_id });
    let message;

    if (channel) {
      message = channel.messages.add(data);
      if (message) {
        channel.messages.delete(message.id);
        message.deleted = true;
        /**
         * Emitted whenever a message is deleted.
         * @event Client#messageDelete
         * @param {Message} message The deleted message
         */
        client.emit(Events.MESSAGE_DELETE, message);
      }
    }

    return { message };
  }
}


module.exports = MessageDeleteAction;
