'use strict';

const CachedManager = require('./CachedManager');
const MessageReaction = require('../structures/MessageReaction');

/**
 * Manages API methods for reactions and holds their cache.
 * @extends {CachedManager}
 */
class ReactionManager extends CachedManager {
  constructor(message, iterable) {
    super(message.client, MessageReaction, iterable);

    /**
     * The message that this manager belongs to
     * @type {Message}
     */
    this.message = message;
  }

  _add(data, cache) {
    return super._add(data, cache, { id: data.emoji.id ?? data.emoji.name, extras: [this.message] });
  }

  /**
   * The reaction cache of this manager
   * @type {Collection<string|Snowflake, MessageReaction>}
   * @name ReactionManager#cache
   */

  /**
   * Data that can be resolved to a MessageReaction object. This can be:
   * * A MessageReaction
   * * A Snowflake
   * @typedef {MessageReaction|Snowflake} MessageReactionResolvable
   */

  /**
   * Resolves a {@link MessageReactionResolvable} to a {@link MessageReaction} object.
   * @method resolve
   * @memberof ReactionManager
   * @instance
   * @param {MessageReactionResolvable} reaction The MessageReaction to resolve
   * @returns {?MessageReaction}
   */

  /**
   * Resolves a {@link MessageReactionResolvable} to a {@link MessageReaction} id.
   * @method resolveId
   * @memberof ReactionManager
   * @instance
   * @param {MessageReactionResolvable} reaction The MessageReaction to resolve
   * @returns {?Snowflake}
   */

  /**
   * Removes all reactions from a message.
   * @returns {Promise<Message>}
   */
  async removeAll() {
    await this.client.api.channels(this.message.channel.id).messages(this.message.id).reactions.delete();
    return this.message;
  }
}

module.exports = ReactionManager;
