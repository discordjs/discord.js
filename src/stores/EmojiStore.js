const DataStore = require('./DataStore');
const Emoji = require('../structures/Emoji');
const ReactionEmoji = require('../structures/ReactionEmoji');

/**
 * Stores emojis.
 * @private
 * @extends {DataStore}
 */
class EmojiStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, Emoji);
    this.guild = guild;
  }

  create(data, cache) {
    return super.create(data, cache, { extras: [this.guild] });
  }

  /**
   * Data that can be resolved into an Emoji object. This can be:
   * * A custom emoji ID
   * * An Emoji object
   * * A ReactionEmoji object
   * @typedef {Snowflake|Emoji|ReactionEmoji} EmojiResolvable
   */

  /**
   * Resolves a EmojiResolvable to a Emoji object.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?Emoji}
   */
  resolve(emoji) {
    if (emoji instanceof ReactionEmoji) return super.resolve(emoji.id);
    return super.resolve(emoji);
  }

  /**
   * Resolves a EmojiResolvable to a Emoji ID string.
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
   * * An EmojiResolveable
   * @typedef {string|EmojiResolvable} EmojiIdentifierResolvable
   */

  /**
   * Resolves an EmojiResolvable to an emoji identifier.
   * @param {EmojiIdentifierResolvable} emoji The emoji resolvable to resolve
   * @returns {?string}
   */
  resolveIdentifier(emoji) {
    const emojiResolveable = this.resolve(emoji);
    if (emojiResolveable) return emojiResolveable.identifier;
    if (typeof emoji === 'string') {
      if (!emoji.includes('%')) return encodeURIComponent(emoji);
      else return emoji;
    }
    return null;
  }
}

module.exports = EmojiStore;
