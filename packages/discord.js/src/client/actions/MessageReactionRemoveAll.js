'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class MessageReactionRemoveAll extends Action {
  handle(data) {
    // Verify channel
    const channel = this.getChannel({ id: data.channel_id, guild_id: data.guild_id });
    if (!channel?.isTextBased()) return false;

    // Verify message
    const message = this.getMessage(data, channel);
    if (!message) return false;

    // Copy removed reactions to emit for the event.
    const removed = message.reactions.cache.clone();

    message.reactions.cache.clear();
    this.client.emit(Events.MessageReactionRemoveAll, message, removed);

    return { message };
  }
}

/**
 * Emitted whenever all reactions are removed from a cached message.
 * @event Client#messageReactionRemoveAll
 * @param {Message} message The message the reactions were removed from
 * @param {Collection<string|Snowflake, MessageReaction>} reactions The cached message reactions that were removed.
 */

module.exports = MessageReactionRemoveAll;
