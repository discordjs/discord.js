'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class MessageReactionRemove extends Action {
  handle(data) {
    if (!data.emoji) return false;

    const user = this.getUser(data);
    if (!user) return false;

    // Verify channel
    const channel = this.getChannel(data);
    if (!channel || channel.type === 'voice') return false;

    // Verify message
    const message = this.getMessage(data, channel);
    if (!message) return false;

    // Verify reaction
    const reaction = this.getReaction(data, message, user);
    if (!reaction) return false;
    reaction._remove(user);
    /**
     * Emitted whenever a reaction is removed from a cached message.
     * @event Client#messageReactionRemove
     * @param {MessageReaction} messageReaction The reaction object
     * @param {User} user The user whose emoji or reaction emoji was removed
     */
    this.client.emit(Events.MESSAGE_REACTION_REMOVE, reaction, user);

    return { message, reaction, user };
  }
}


module.exports = MessageReactionRemove;
