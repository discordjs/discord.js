const Action = require('./Action');

class MessageReactionRemoveAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.channel_id);
    let unique = null;
    if (data.emoji.id !== null) unique = `${data.emoji.name}${data.emoji.id}`;

    const name = unique || data.emoji.name;
    if (channel) {
      const message = channel.messages.get(data.message_id);
      if (message) {
        if (!message.reactions.has(name)) return;
        let reaction = message.reactions.get(name);
        reaction.count--;
        if (reaction.count === 0) message.reactions.delete(name);
      }
    }

    return;
  }
}

module.exports = MessageReactionRemoveAction;
