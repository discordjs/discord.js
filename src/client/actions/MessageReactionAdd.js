const Action = require('./Action');

class MessageReactionAddAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.channel_id);

    let unique = null;
    if (data.emoji.id !== null) unique = `${data.emoji.name}${data.emoji.id}`;

    const name = unique || data.emoji.name;

    if (channel) {
      const message = channel.messages.get(data.message_id);
      if (message) {
        if (message.reactions.has(name)) {
          message.reactions.get(name).count++;
        } else {
          message.reactions.set(name, {
            count: 1,
            me: data.user_id === client.user.id,
            emoji: data.emoji,
          });
        }
      }
    }

    return;
  }
}

module.exports = MessageReactionAddAction;
