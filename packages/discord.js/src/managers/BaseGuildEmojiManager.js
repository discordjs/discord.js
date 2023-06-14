'use strict';

const CachedManager = require('./CachedManager');
const GuildEmoji = require('../structures/GuildEmoji');
const ReactionEmoji = require('../structures/ReactionEmoji');
const { parseEmoji } = require('../util/Util');

/**
 * Holds methods to resolve GuildEmojis and stores their cache.
 * @extends {CachedManager}
 */
class BaseGuildEmojiManager extends CachedManager {
  constructor(client, iterable) {
    super(client, GuildEmoji, iterable);
  }

  /**
   * The cache of GuildEmojis
   * @type {Collection<Snowflake, GuildEmoji>}
   * @name BaseGuildEmojiManager#cache
   */

  /**
   * Data that can be resolved into a GuildEmoji object. This can be:
   * * A Snowflake
   * * A GuildEmoji object
   * * A ReactionEmoji object
   * @typedef {Snowflake|GuildEmoji|ReactionEmoji} EmojiResolvable
   */

  /**
   * Resolves an EmojiResolvable to an Emoji object.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?GuildEmoji}
   */
  resolve(emoji) {
    if (emoji instanceof ReactionEmoji) return super.resolve(emoji.id);
    return super.resolve(emoji);
  }

  /**
   * Resolves an EmojiResolvable to an Emoji id string.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?Snowflake}
   */
  resolveId(emoji) {
    if (emoji instanceof ReactionEmoji) return emoji.id;
    return super.resolveId(emoji);
  }

  /**
   * Data that can be resolved to give an emoji identifier. This can be:
   * * An EmojiResolvable
   * * The `<a:name:id>`, `<:name:id>`, `a:name:id` or `name:id` emoji identifier string of an emoji
   * * The Unicode representation of an emoji
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
      if (res?.name.length) {
        emoji = `${res.animated ? 'a:' : ''}${res.name}${res.id ? `:${res.id}` : ''}`;
      }
      if (!emoji.includes('%')) return encodeURIComponent(emoji);
      return emoji;
    }
    return null;
  }
}

module.exports = BaseGuildEmojiManager;
