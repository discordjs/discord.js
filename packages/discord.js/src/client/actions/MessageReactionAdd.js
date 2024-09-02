'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');
const Partials = require('../../util/Partials');

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id',
     burst: boolean
     // If originating from a guild
     guild_id: 'id',
     member: { ..., user: { ... } } }
*/

class MessageReactionAdd extends Action {
  handle(data, fromStructure = false) {
    if (!data.emoji) return false;

    const user = this.getUserFromMember(data);
    if (!user) return false;

    // Verify channel
    const channel = this.getChannel({
      id: data.channel_id,
      guild_id: data.guild_id,
      user_id: data.user_id,
      ...this.spreadInjectedData(data),
    });

    if (!channel?.isTextBased()) return false;

    // Verify message
    const message = this.getMessage(data, channel);
    if (!message) return false;

    // Verify reaction
    const includePartial = this.client.options.partials.includes(Partials.Reaction);
    if (message.partial && !includePartial) return false;
    const reaction = message.reactions._add({
      emoji: data.emoji,
      count: message.partial ? null : 0,
      me: user.id === this.client.user.id,
      burst_colors: data.burst_colors,
    });
    if (!reaction) return false;
    reaction._add(user, data.burst);
    if (fromStructure) return { message, reaction, user };
    /**
     * Provides additional information about altered reaction
     * @typedef {Object} MessageReactionEventDetails
     * @property {boolean} burst Determines whether a super reaction was used
     */
    /**
     * Emitted whenever a reaction is added to a cached message.
     * @event Client#messageReactionAdd
     * @param {MessageReaction} messageReaction The reaction object
     * @param {User} user The user that applied the guild or reaction emoji
     * @param {MessageReactionEventDetails} details Details of adding the reaction
     */
    this.client.emit(Events.MessageReactionAdd, reaction, user, { burst: data.burst });

    return { message, reaction, user };
  }
}

module.exports = MessageReactionAdd;
