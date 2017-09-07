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

  /**
   * Data that can be resolved to a MessageReaction object. This can be:
   * * A MessageReaction
   * * A Snowflake
   * @typedef {MessageReaction|Snowflake} MessageReactionResolvable
   */

  /**
	* Resolves a MessageReactionResolvable to a MessageReaction object.
	* @name resolve
	* @memberof ReactionStore
    * @param {MessageReactionResolvable} reaction The MessageReaction to resolve
    * @returns {?MessageReaction}
    */

  /**
	* Resolves a MessageReactionResolvable to a MessageReaction ID string.
	* @name resolveID
	* @memberof ReactionStore
    * @param {MessageReactionResolvable} role The role resolvable to resolve
    * @returns {?string}
    */
}

module.exports = ReactionStore;
