const Action = require('./Action');
const Constants = require('../../util/Constants');

class MessageReactionRemoveEmoji extends Action {
  handle(data) {
    // Verify channel
    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;
    // Verify message
    const message = channel.messages.get(data.message_id);
    if (!message) return false;
    if (!data.emoji) return false;
    // Verify reaction
    const reaction = message._removeReaction(data.emoji);
    if (reaction) this.client.emit(Constants.Events.MESSAGE_REACTION_REMOVE_EMOJI, reaction);

    return { message, reaction };
  }
}

/**
 * Emitted whenever a reaction emoji is removed from a cached message.
 * @event Client#messageReactionRemoveEmoji
 * @param {MessageReaction} messageReaction The reaction object
 */

module.exports = MessageReactionRemoveEmoji;
