'use strict';

const { Routes } = require('discord-api-types/v10');
const GuildEmoji = require('./GuildEmoji');
const ReactionEmoji = require('./ReactionEmoji');
const ReactionUserManager = require('../managers/ReactionUserManager');
const { flatten } = require('../util/Util');

/**
 * Represents a reaction to a message.
 */
class MessageReaction {
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
     * Whether the client has super-reacted using this emoji
     * @type {boolean}
     */
    this.meBurst = data.me_burst;

    /**
     * A manager of the users that have given this reaction
     * @type {ReactionUserManager}
     */
    this.users = new ReactionUserManager(this, this.me ? [client.user] : []);

    this._emoji = new ReactionEmoji(this, data.emoji);

    this.burstColors = null;

    this._patch(data);
  }

  _patch(data) {
    if ('burst_colors' in data) {
      /**
       * Hexadecimal colors used for this super reaction
       * @type {?string[]}
       */
      this.burstColors = data.burst_colors;
    }

    if ('count' in data) {
      /**
       * The number of people that have given the same reaction
       * @type {?number}
       */
      this.count ??= data.count;
    }

    if ('count_details' in data) {
      /**
       * The reaction count details object contains information about super and normal reaction counts.
       * @typedef {Object} ReactionCountDetailsData
       * @property {number} burst Count of super reactions
       * @property {number} normal Count of normal reactions
       */

      /**
       * The reaction count details object contains information about super and normal reaction counts.
       * @type {ReactionCountDetailsData}
       */
      this.countDetails = {
        burst: data.count_details.burst,
        normal: data.count_details.normal,
      };
    } else {
      this.countDetails ??= { burst: 0, normal: 0 };
    }
  }

  /**
   * Makes the client user react with this reaction
   * @returns {Promise<MessageReaction>}
   */
  react() {
    return this.message.react(this.emoji);
  }

  /**
   * Removes all users from this reaction.
   * @returns {Promise<MessageReaction>}
   */
  async remove() {
    await this.client.rest.delete(
      Routes.channelMessageReaction(this.message.channelId, this.message.id, this._emoji.identifier),
    );
    return this;
  }

  /**
   * The emoji of this reaction. Either a {@link GuildEmoji} object for known custom emojis, or a {@link ReactionEmoji}
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
    const existing = message.reactions.cache.get(this.emoji.id ?? this.emoji.name);
    // The reaction won't get set when it has been completely removed
    this._patch(existing ?? { count: 0 });
    return this;
  }

  toJSON() {
    return flatten(this, { emoji: 'emojiId', message: 'messageId' });
  }

  valueOf() {
    return this._emoji.id ?? this._emoji.name;
  }

  _add(user, burst) {
    if (this.partial) return;
    this.users.cache.set(user.id, user);
    if (!this.me || user.id !== this.message.client.user.id || this.count === 0) {
      this.count++;
      if (burst) this.countDetails.burst++;
      else this.countDetails.normal++;
    }
    if (user.id === this.message.client.user.id) {
      if (burst) this.meBurst = true;
      else this.me = true;
    }
  }
  _remove(user, burst) {
    if (this.partial) return;
    this.users.cache.delete(user.id);
    if (!this.me || user.id !== this.message.client.user.id) {
      this.count--;
      if (burst) this.countDetails.burst--;
      else this.countDetails.normal--;
    }
    if (user.id === this.message.client.user.id) {
      if (burst) this.meBurst = false;
      else this.me = false;
    }
    if (this.count <= 0 && this.users.cache.size === 0) {
      this.message.reactions.cache.delete(this.emoji.id ?? this.emoji.name);
    }
  }
}

module.exports = MessageReaction;
