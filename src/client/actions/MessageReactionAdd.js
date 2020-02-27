'use strict';

const Action = require('./Action');
const { Events, PartialTypes } = require('../../util/Constants');

class MessageReactionAdd extends Action {
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
    if (message.partial && !this.client.options.partials.includes(PartialTypes.REACTION)) return false;
    const reaction = message.reactions.add({
      emoji: data.emoji,
      count: message.partial ? null : 0,
      me: user.id === this.client.user.id,
    });
    if (!reaction) return false;
    reaction._add(user);
    /**
     * Emitted whenever a reaction is added to a cached message.
     * @event Client#messageReactionAdd
     * @param {MessageReaction} messageReaction The reaction object
     * @param {User} user The user that applied the guild or reaction emoji
     */
    this.client.emit(Events.MESSAGE_REACTION_ADD, reaction, user);

    return { message, reaction, user };
  }
}

module.exports = MessageReactionAdd;
