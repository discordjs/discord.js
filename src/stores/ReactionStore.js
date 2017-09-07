const DataStore = require('./DataStore');
const MessageReaction = require('../structures/MessageReaction');
/**
 * Stores reactions.
 * @private
 * @extends {DataStore}
 */
class ReactionStore extends DataStore {
  constructor(message, iterable) {
    super(message.client, iterable, MessageReaction);
    this.message = message;
  }

  create(data, cache) {
    data.emoji.id = data.emoji.id || decodeURIComponent(data.emoji.name);
    return super.create(data, cache, this.message);
  }
}

module.exports = ReactionStore;
