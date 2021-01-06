'use strict';

const GuildEmoji = require('./GuildEmoji');
const ReactionEmoji = require('./ReactionEmoji');
const ReactionUserManager = require('../managers/ReactionUserManager');
const Util = require('../util/Util');

/**
 * Represents a reaction to a message.
 */
class MessageReaction {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the message reaction
   * @param {Message} message The message the reaction refers to
   */
  constructor(client, data, message) {
    /**
     * The client that instantiated this message reaction
     * @name MessageReaction#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
    /**
     * The message that this reaction refers to
     * @type {Message}
     */
    this.message = message;

    /**
     * Whether the client has given this reaction
     * @type {boolean}
     */
    this.me = data.me;

    /**
     * A manager of the users that have given this reaction
     * @type {ReactionUserManager}
     */
    this.users = new ReactionUserManager(client, undefined, this);

    this._emoji = new ReactionEmoji(this, data.emoji);

    this._patch(data);
  }

  _patch(data) {
    // eslint-disable-next-line eqeqeq
    if (this.count == undefined) {
      /**
       * The number of people that have given the same reaction
       * @type {?number}
       */
      this.count = data.count;
    }
  }

  /**
   * Removes all users from this reaction.
   * @returns {Promise<MessageReaction>}
   */
  async remove() {
    await this.client.api
      .channels(this.message.channel.id)
      .messages(this.message.id)
      .reactions(this._emoji.identifier)
      .delete();
    return this;
  }

  /**
   * The emoji of this reaction, either an GuildEmoji object for known custom emojis, or a ReactionEmoji
   * object which has fewer properties. Whatever the prototype of the emoji, it will still have
   * `name`, `id`, `identifier` and `toString()`
   * @type {GuildEmoji|ReactionEmoji}
   * @readonly
   */
  get emoji() {
    if (this._emoji instanceof GuildEmoji) return this._emoji;
    // Check to see if the emoji has become known to the client
    if (this._emoji.id) {
      const emojis = this.message.client.emojis.cache;
      if (emojis.has(this._emoji.id)) {
        const emoji = emojis.get(this._emoji.id);
        this._emoji = emoji;
        return emoji;
      }
    }
    return this._emoji;
  }

  /**
   * Whether or not this reaction is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return this.count === null;
  }

  /**
   * Fetch this reaction.
   * @returns {Promise<MessageReaction>}
   */
  async fetch() {
    const message = await this.message.fetch();
    const existing = message.reactions.cache.get(this.emoji.id || this.emoji.name);
    // The reaction won't get set when it has been completely removed
    this._patch(existing || { count: 0 });
    return this;
  }

  toJSON() {
    return Util.flatten(this, { emoji: 'emojiID', message: 'messageID' });
  }

  _add(user) {
    if (this.partial) return;
    this.users.cache.set(user.id, user);
    if (!this.me || user.id !== this.message.client.user.id || this.count === 0) this.count++;
    if (!this.me) this.me = user.id === this.message.client.user.id;
  }

  _remove(user) {
    if (this.partial) return;
    this.users.cache.delete(user.id);
    if (!this.me || user.id !== this.message.client.user.id) this.count--;
    if (user.id === this.message.client.user.id) this.me = false;
    if (this.count <= 0 && this.users.cache.size === 0) {
      this.message.reactions.cache.delete(this.emoji.id || this.emoji.name);
    }
  }
}

module.exports = MessageReaction;
