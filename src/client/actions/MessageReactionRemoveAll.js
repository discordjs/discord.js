const Action = require('./Action');
const Constants = require('../../util/Constants');

class MessageReactionRemoveAll extends Action {
  async handle(data) {
    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;

    var message = channel.messages.get(data.message_id);
    if (!message) message = await channel.fetchMessage(data.message_id);
    if (!message) return false;

    message._clearReactions();
    this.client.emit(Constants.Events.MESSAGE_REACTION_REMOVE_ALL, message);

    return { message };
  }
}

/**
 * Emitted whenever all reactions are removed from a cached message.
 * @event Client#messageReactionRemoveAll
 * @param {Message} message The message the reactions were removed from
 */

module.exports = MessageReactionRemoveAll;
