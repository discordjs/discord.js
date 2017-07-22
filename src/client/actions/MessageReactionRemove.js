const Action = require('./Action');
const Constants = require('../../util/Constants');

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id' } }
*/

class MessageReactionRemove extends Action {
  async handle(data) {
    const user = this.client.users.get(data.user_id);
    if (!user) return false;
    // Verify channel
    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;
    // Verify message
    const message = channel.messages.get(data.message_id);
    if (!data.emoji) return false;
    if (!message) {
      if (this.client.options.autofetch.includes(Constants.WSEvents.MESSAGE_REACTION_REMOVE)) {
        // Check if message is fetchable
        if (!channel.permissionsFor(channel.guild.me).has('READ_MESSAGES')) return false;

        try {
          const fetchedMessage = await channel.fetchMessage(data.message_id);
          const reaction = fetchedMessage._addReaction(data.emoji, user);
          this.client.emit(Constants.Events.MESSAGE_REACTION_REMOVE, reaction, user);
        } catch (e) {
          this.client.emit('debug', 'Could not autofetch message');
        }
      }
      return false;
    }
    // Verify reaction
    const reaction = message._removeReaction(data.emoji, user);
    if (reaction) this.client.emit(Constants.Events.MESSAGE_REACTION_REMOVE, reaction, user);

    return { message, reaction, user };
  }
}

/**
 * Emitted whenever a reaction is removed from a message.
 * @event Client#messageReactionRemove
 * @param {MessageReaction} messageReaction The reaction object
 * @param {User} user The user that removed the emoji or reaction emoji
 */

module.exports = MessageReactionRemove;
