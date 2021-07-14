'use strict';

const Action = require('./Action');
const { Events, VoiceBasedChannelTypes } = require('../../util/Constants');

class MessageReactionRemoveEmoji extends Action {
  handle(data) {
    const channel = this.getChannel(data);
    if (!channel || VoiceBasedChannelTypes.includes(channel.type)) return false;

    const message = this.getMessage(data, channel);
    if (!message) return false;

    const reaction = this.getReaction(data, message);
    if (!reaction) return false;
    if (!message.partial) message.reactions.cache.delete(reaction.emoji.id ?? reaction.emoji.name);

    /**
     * Emitted when a bot removes an emoji reaction from a cached message.
     * @event Client#messageReactionRemoveEmoji
     * @param {MessageReaction} reaction The reaction that was removed
     */
    this.client.emit(Events.MESSAGE_REACTION_REMOVE_EMOJI, reaction);
    return { reaction };
  }
}

module.exports = MessageReactionRemoveEmoji;
