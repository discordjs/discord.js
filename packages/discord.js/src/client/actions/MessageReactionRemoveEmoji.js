'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class MessageReactionRemoveEmoji extends Action {
  handle(data) {
    const channel = this.getChannel({ id: data.channel_id, ...('guild_id' in data && { guild_id: data.guild_id }) });
    if (!channel?.isTextBased()) return false;

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
    this.client.emit(Events.MessageReactionRemoveEmoji, reaction);
    return { reaction };
  }
}

module.exports = MessageReactionRemoveEmoji;
