'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id',
     guild_id: 'id' }
*/

class MessageReactionRemove extends Action {
  handle(data) {
    if (!data.emoji) return false;

    const user = this.getUser(data);
    if (!user) return false;

    // Verify channel
    const channel = this.getChannel({
      id: data.channel_id,
      ...('guild_id' in data && { guild_id: data.guild_id }),
      user_id: data.user_id,
    });
    if (!channel?.isTextBased()) return false;

    // Verify message
    const message = this.getMessage(data, channel);
    if (!message) return false;

    // Verify reaction
    const reaction = this.getReaction(data, message, user);
    if (!reaction) return false;
    reaction._remove(user, data.burst);
    /**
     * Emitted whenever a reaction is removed from a cached message.
     * @event Client#messageReactionRemove
     * @param {MessageReaction} messageReaction The reaction object
     * @param {User} user The user whose emoji or reaction emoji was removed
     * @param {MessageReactionEventDetails} details Details of removing the reaction
     */
    this.client.emit(Events.MessageReactionRemove, reaction, user, { burst: data.burst });

    return { message, reaction, user };
  }
}

module.exports = MessageReactionRemove;
