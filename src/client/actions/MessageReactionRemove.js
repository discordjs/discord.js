'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

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

    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    let member = null;
    if (guild) member = this.getMember({ user: { id: data.user_id } }, guild);
    else member = this.getUserFromMember(data);
    if (!member) return false;

    // Verify channel
    const channel = this.getChannel(data);
    if (!channel || channel.type === 'voice') return false;

    // Verify message
    const message = this.getMessage(data, channel);
    if (!message) return false;

    // Verify reaction
    const reaction = this.getReaction(data, message, member);
    if (!reaction) return false;
    reaction._remove(member);
    /**
     * Emitted whenever a reaction is removed from a cached message.
     * @event Client#messageReactionRemove
     * @param {MessageReaction} messageReaction The reaction object
     * @param {GuildMember} member The guild member whose emoji or reaction emoji was removed
     */
    this.client.emit(Events.MESSAGE_REACTION_REMOVE, reaction, member);

    return { message, reaction, member };
  }
}

module.exports = MessageReactionRemove;
