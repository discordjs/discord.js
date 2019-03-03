'use strict';

const GuildEmoji = require('./GuildEmoji');
const Util = require('../util/Util');
const ReactionEmoji = require('./ReactionEmoji');
const ReactionUserStore = require('../stores/ReactionUserStore');

/**
 * Represents a reaction to a message.
 */
class MessageReaction {
  constructor(client, data, message) {
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
     * The number of people that have given the same reaction
     * @type {number}
     */
    this.count = data.count || 0;

    /**
     * The users that have given this reaction, mapped by their ID
     * @type {ReactionUserStore<Snowflake, User>}
     */
    this.users = new ReactionUserStore(client, undefined, this);

    this._emoji = new ReactionEmoji(this, data.emoji);
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
      const emojis = this.message.client.emojis;
      if (emojis.has(this._emoji.id)) {
        const emoji = emojis.get(this._emoji.id);
        this._emoji = emoji;
        return emoji;
      }
    }
    return this._emoji;
  }


  toJSON() {
    return Util.flatten(this, { emoji: 'emojiID', message: 'messageID' });
  }

  _add(user) {
    this.users.set(user.id, user);
    if (!this.me || user.id !== this.message.client.user.id || this.count === 0) this.count++;
    if (!this.me) this.me = user.id === this.message.client.user.id;
  }

  _remove(user) {
    this.users.delete(user.id);
    if (!this.me || user.id !== this.message.client.user.id) this.count--;
    if (user.id === this.message.client.user.id) this.me = false;
    if (this.count <= 0 && this.users.size === 0) {
      this.message.reactions.remove(this.emoji.id || this.emoji.name);
    }
  }
}

module.exports = MessageReaction;
