'use strict';

const BaseManager = require('./BaseManager');
const ReactionEmoji = require('../structures/ReactionEmoji');
const ServerEmoji = require('../structures/ServerEmoji');
const { parseEmoji } = require('../util/Util');

/**
 * Holds methods to resolve ServerEmojis and stores their cache.
 * @extends {BaseManager}
 */
class BaseServerEmojiManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, ServerEmoji);
  }

  /**
   * The cache of ServerEmojis
   * @type {Collection<Snowflake, ServerEmoji>}
   * @name BaseServerEmojiManager#cache
   */

  /**
   * Data that can be resolved into a ServerEmoji object. This can be:
   * * A custom emoji ID
   * * A ServerEmoji object
   * * A ReactionEmoji object
   * @typedef {Snowflake|ServerEmoji|ReactionEmoji} EmojiResolvable
   */

  /**
   * Resolves an EmojiResolvable to an Emoji object.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?ServerEmoji}
   */
  resolve(emoji) {
    if (emoji instanceof ReactionEmoji) return super.resolve(emoji.id);
    return super.resolve(emoji);
  }

  /**
   * Resolves an EmojiResolvable to an Emoji ID string.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?Snowflake}
   */
  resolveID(emoji) {
    if (emoji instanceof ReactionEmoji) return emoji.id;
    return super.resolveID(emoji);
  }

  /**
   * Data that can be resolved to give an emoji identifier. This can be:
   * * The unicode representation of an emoji
   * * The `<a:name:id>`, `<:name:id>`, `a:name:id` or `name:id` emoji identifier string of an emoji
   * * An EmojiResolvable
   * @typedef {string|EmojiResolvable} EmojiIdentifierResolvable
   */

  /**
   * Resolves an EmojiResolvable to an emoji identifier.
   * @param {EmojiIdentifierResolvable} emoji The emoji resolvable to resolve
   * @returns {?string}
   */
  resolveIdentifier(emoji) {
    const emojiResolvable = this.resolve(emoji);
    if (emojiResolvable) return emojiResolvable.identifier;
    if (emoji instanceof ReactionEmoji) return emoji.identifier;
    if (typeof emoji === 'string') {
      const res = parseEmoji(emoji);
      if (res && res.name.length) {
        emoji = `${res.animated ? 'a:' : ''}${res.name}${res.id ? `:${res.id}` : ''}`;
      }
      if (!emoji.includes('%')) return encodeURIComponent(emoji);
      return emoji;
    }
    return null;
  }
}

module.exports = BaseServerEmojiManager;
