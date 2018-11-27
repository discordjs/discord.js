const Action = require('./Action');

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id' } }
*/

class MessageReactionAdd extends Action {
  handle(data) {
    const user = data.user || this.client.users.get(data.user_id);
    if (!user) return false;
    // Verify channel
    const channel = data.channel || this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;
    // Verify message
    const message = data.message || channel.messages.get(data.message_id);
    if (!message) return false;
    if (!data.emoji) return false;
    // Verify reaction
    const reaction = message.reactions.add({
      emoji: data.emoji,
      count: 0,
      me: user.id === this.client.user.id,
    });
    reaction._add(user);
    return { message, reaction, user };
  }
}

module.exports = MessageReactionAdd;
