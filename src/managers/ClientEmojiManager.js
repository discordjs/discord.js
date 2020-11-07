'use strict';

const GuildEmoji = require('../structures/GuildEmoji');
const ReactionEmoji = require('../structures/ReactionEmoji');
const Collection = require('../util/Collection');
const { parseEmoji } = require('../util/Util');

/**
 * Manages all emojis known to the client.
 */
class ClientEmojiManager {
  constructor(client) {
    /**
     * The client that instantiated this Collector
     * @name ClientEmojiManager#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
  }

  /**
   * All custom emojis that the client has access to, mapped by their IDs
   * @type {Collection<string, GuildEmoji>}
   * @readonly
   */
  get cache() {
    const emojis = new Collection();
    for (const [id, emoji] of this) {
      emojis.set(id, emoji);
    }

    return emojis;
  }

  /**
   * An iterator for all available guilds the client is in.
   * @readonly
   */
  get guilds() {
    function* iterate(client) {
      for (const guild of client.guilds.cache.values()) if (guild.available) yield guild;
    }
    return iterate(this.client);
  }

  /* eslint-disable consistent-return */
  /**
   * Get an emoji from a guild the client is in.
   * @param {string} id The ID of the emoji to get
   * @returns {GuildEmoji}
   */
  get(id) {
    id = this.resolveID(id);
    for (const g of this.guilds) if (g.emojis.cache.has(id)) return g.emojis.cache.get(id);
  }
  /* eslint-enable consistent-return */

  /**
   * Whether or not an emoji is cached in any of the client's guilds.
   * @param {string} id The ID of the emoji to check
   * @returns {boolean}
   */
  has(id) {
    id = this.resolveID(id);
    for (const g of this.guilds) if (g.emojis.cache.has(id)) return true;
    return false;
  }

  /**
   * Resolves an EmojiResolvable to an Emoji object.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?GuildEmoji}
   */
  resolve(emoji) {
    if (emoji instanceof GuildEmoji) return emoji;
    if (emoji instanceof ReactionEmoji) return this.get(emoji.id);
    if (typeof emoji === 'string') return this.get(emoji) || null;
    return null;
  }

  /**
   * Resolves an EmojiResolvable to an Emoji ID string.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?Snowflake}
   */
  resolveID(emoji) {
    if (emoji instanceof GuildEmoji || emoji instanceof ReactionEmoji) return emoji.id;
    if (typeof emoji === 'string') return emoji;
    return null;
  }

  /**
   * Data that can be resolved to give an emoji identifier. This can be:
   * * The unicode representation of an emoji
   * * The `<a:name:id>`, `<:name:id>`, `:name:id` or `a:name:id` emoji identifier string of an emoji
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
      else return emoji;
    }
    return null;
  }

  /**
   * The number of emojis known to the client.
   * @type {number}
   * @readonly
   */
  get size() {
    let num = 0;
    for (const guild of this.guilds) num += guild.emojis.cache.size;
    return num;
  }

  /**
   * Iterate through every emoji the client can use, in a key-value pair.
   */
  *[Symbol.iterator]() {
    for (const guild of this.guilds) for (const [id, emoji] of guild.emojis.cache) yield [id, emoji];
  }

  /**
   * Iterate through every emoji the client can use, in a key-value pair.
   */
  *entries() {
    yield* this[Symbol.iterator]();
  }

  /**
   * An iterator that contains the IDs of every emoji the client has access to.
   */
  *keys() {
    for (const emoji of this) yield emoji[0];
  }

  /**
   * An iterator that contains each emoji the client has access to.
   */
  *values() {
    for (const emoji of this) yield emoji[1];
  }

  valueOf() {
    return this.cache;
  }
}

module.exports = ClientEmojiManager;
