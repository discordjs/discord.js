'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const { PartialTypes } = require('../../util/Constants');

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id',
     // If originating from a guild
     guild_id: 'id',
     member: { ..., user: { ... } } }
*/

class MessageReactionAdd extends Action {
  handle(data) {
    if (!data.emoji) return false;

    const member = this.getMember(data);
    if (!member) return false;

    // Verify channel
    const channel = this.getChannel(data);
    if (!channel || channel.type === 'voice') return false;

    // Verify message
    const message = this.getMessage(data, channel);
    if (!message) return false;

    // Verify reaction
    if (message.partial && !this.client.options.partials.includes(PartialTypes.REACTION)) return false;
    const existing = message.reactions.cache.get(data.emoji.id || data.emoji.name);
    if (existing && existing.users.cache.has(member.user.id)) return { message, reaction: existing, member };
    const reaction = message.reactions.add({
      emoji: data.emoji,
      count: message.partial ? null : 0,
      me: member.user.id === this.client.user.id,
    });
    if (!reaction) return false;
    reaction._add(member);
    /**
     * Emitted whenever a reaction is added to a cached message.
     * @event Client#messageReactionAdd
     * @param {MessageReaction} messageReaction The reaction object
     * @param {Member} member The guild member that applied the guild or reaction emoji
     */
    this.client.emit(Events.MESSAGE_REACTION_ADD, reaction, member);

    return { message, reaction, member };
  }
}

module.exports = MessageReactionAdd;
