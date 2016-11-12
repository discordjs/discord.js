const Action = require('./Action');
const Constants = require('../../util/Constants');

class MessageReactionRemoveAll extends Action {
  handle(data) {
    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;

    const message = channel.messages.get(data.message_id);
    if (!message) return false;

    message._removeReactions();
    this.client.emit(Constants.Events.MESSAGE_REACTION_REMOVE_ALL, message);

    return {
      message,
    };
  }
}

module.exports = MessageReactionRemoveAll;
