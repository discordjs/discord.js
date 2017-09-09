const DataStore = require('./DataStore');
const MessageReaction = require('../structures/MessageReaction');
/**
 * Stores reactions.
 * @private
 * @extends {DataStore}
 */
class ReactionStore extends DataStore {
  constructor(message, iterable) {
    super(message.client, iterable);
    this.message = message;
  }

  create(data) {
    const emojiID = data.emoji.id || decodeURIComponent(data.emoji.name);

    const existing = this.get(emojiID);
    if (existing) return existing;

    const reaction = new MessageReaction(this.message, data.emoji, data.count, data.me);
    this.set(emojiID, reaction);

    return reaction;
  }
}

module.exports = ReactionStore;
