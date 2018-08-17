const Action = require('./Action');
const { Events } = require('../../util/Constants');

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id' } }
*/

class MessageReactionRemove extends Action {
  handle(data) {
    this._patch(data);
    const user = this.client.users.get(data.user_id);
    if (!user) return false;
    // Verify channel
    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;
    // Verify message
    const message = channel.messages.get(data.message_id);
    if (!message) return false;
    if (!data.emoji) return false;
    // Verify reaction
    const emojiID = data.emoji.id || decodeURIComponent(data.emoji.name);
    const reaction = message.reactions.get(emojiID);
    if (!reaction) return false;
    reaction._remove(user);
    this.client.emit(Events.MESSAGE_REACTION_REMOVE, reaction, user);

    return { message, reaction, user };
  }

  _patch(data) {
    data.user_id = BigInt(data.user_id);
    data.channel_id = BigInt(data.channel_id);
    data.message_id = BigInt(data.channel_id);
    if (data.emoji.id) data.emoji.id = BigInt(data.emoji.id);
  }
}

/**
 * Emitted whenever a reaction is removed from a cached message.
 * @event Client#messageReactionRemove
 * @param {MessageReaction} messageReaction The reaction object
 * @param {User} user The user that removed the emoji or reaction emoji
 */

module.exports = MessageReactionRemove;
