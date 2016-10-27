const Collection = require('../util/Collection');
const parseEmoji = require('../util/ParseEmoji');

/**
 * Represents a reaction to a message
 */
class MessageReaction {
  constructor(message, emoji, count) {
    /**
     * The message that this reaction refers to
     * @type {Message}
     */
    this.message = message;
    /**
     * The emoji of this reaction, if this is a string it is a plain unicode emoji.
     * @type {Emoji}
     */
    this.emoji = emoji;
    /**
     * The number of people that have given the same reaction.
     * @type {number}
     */
    this.count = count || 0;
    /**
     * The users that have given this reaction, mapped by their ID.
     * @type {Collection<string, User>}
     */
    this.users = new Collection();
  }

  /**
   * If the client has given this reaction to a message, it is removed.
   * @returns {Promise<MessageReaction>}
   */
  remove() {
    const message = this.message;
    return message.client.rest.methods.removeMessageReaction(message.channel.id, message.id, parseEmoji(this.emoji));
  }
}

module.exports = MessageReaction;
