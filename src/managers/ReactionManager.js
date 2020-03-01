'use strict';

const BaseManager = require('./BaseManager');
const MessageReaction = require('../structures/MessageReaction');

/**
 * Manages API methods for reactions and holds their cache.
 * @extends {BaseManager}
 */
class ReactionManager extends BaseManager {
  constructor(message, iterable) {
    super(message.client, iterable, MessageReaction);

    /**
     * The message that this manager belongs to
     * @type {Message}
     */
    this.message = message;
  }

  add(data, cache) {
    return super.add(data, cache, { id: data.emoji.id || data.emoji.name, extras: [this.message] });
  }

  /**
   * The reaction cache of this manager
   * @type {Collection<Snowflake, MessageReaction>}
   * @name ReactionManager#cache
   */

  /**
   * Data that can be resolved to a MessageReaction object. This can be:
   * * A MessageReaction
   * * A Snowflake
   * @typedef {MessageReaction|Snowflake} MessageReactionResolvable
   */

  /**
   * Resolves a MessageReactionResolvable to a MessageReaction object.
   * @method resolve
   * @memberof ReactionManager
   * @instance
   * @param {MessageReactionResolvable} reaction The MessageReaction to resolve
   * @returns {?MessageReaction}
   */

  /**
   * Resolves a MessageReactionResolvable to a MessageReaction ID string.
   * @method resolveID
   * @memberof ReactionManager
   * @instance
   * @param {MessageReactionResolvable} reaction The MessageReaction to resolve
   * @returns {?Snowflake}
   */

  /**
   * Removes all reactions from a message.
   * @returns {Promise<Message>}
   */
  removeAll() {
    return this.client.api
      .channels(this.message.channel.id)
      .messages(this.message.id)
      .reactions.delete()
      .then(() => this.message);
  }

  _partial(emoji) {
    const id = emoji.id || emoji.name;
    const existing = this.cache.get(id);
    return !existing || existing.partial;
  }

  async _fetchReaction(reactionEmoji, cache) {
    const id = reactionEmoji.id || reactionEmoji.name;
    const existing = this.cache.get(id);
    if (!this._partial(reactionEmoji)) return existing;
    const data = await this.client.api
      .channels(this.message.channel.id)
      .messages(this.message.id)
      .get();
    if (this.message.partial) this.message._patch(data);
    if (!data.reactions || !data.reactions.some(r => (r.emoji.id || r.emoji.name) === id)) {
      reactionEmoji.reaction._patch({ count: 0 });
      this.message.reactions.cache.delete(id);
      return existing;
    }
    for (const reaction of data.reactions) {
      if (this._partial(reaction.emoji)) this.add(reaction, cache);
    }
    return existing;
  }
}

module.exports = ReactionManager;
