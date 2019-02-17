'use strict';

const Collection = require('../util/Collection');
const DataStore = require('./DataStore');
const GuildEmoji = require('../structures/GuildEmoji');
const ReactionEmoji = require('../structures/ReactionEmoji');
const DataResolver = require('../util/DataResolver');
const { TypeError } = require('../errors');

/**
 * Stores guild emojis.
 * @extends {DataStore}
 */
class GuildEmojiStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildEmoji);
    this.guild = guild;
  }

  add(data, cache) {
    return super.add(data, cache, { extras: [this.guild] });
  }

  /**
   * Creates a new custom emoji in the guild.
   * @param {BufferResolvable|Base64Resolvable} attachment The image for the emoji
   * @param {string} name The name for the emoji
   * @param {Object} [options] Options
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} [options.roles] Roles to limit the emoji to
   * @param {string} [options.reason] Reason for creating the emoji
   * @returns {Promise<Emoji>} The created emoji
   * @example
   * // Create a new emoji from a url
   * guild.emojis.create('https://i.imgur.com/w3duR07.png', 'rip')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   * @example
   * // Create a new emoji from a file on your computer
   * guild.emojis.create('./memes/banana.png', 'banana')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   */
  create(attachment, name, { roles, reason } = {}) {
    if (typeof attachment === 'string' && attachment.startsWith('data:')) {
      const data = { image: attachment, name };
      if (roles) {
        data.roles = [];
        for (let role of roles instanceof Collection ? roles.values() : roles) {
          role = this.guild.roles.resolve(role);
          if (!role) {
            return Promise.reject(new TypeError('INVALID_TYPE', 'options.roles',
              'Array or Collection of Roles or Snowflakes', true));
          }
          data.roles.push(role.id);
        }
      }

      return this.client.api.guilds(this.guild.id).emojis.post({ data, reason })
        .then(emoji => this.client.actions.GuildEmojiCreate.handle(this.guild, emoji).emoji);
    }

    return DataResolver.resolveImage(attachment).then(image => this.create(image, name, { roles, reason }));
  }

  /**
   * Data that can be resolved into an GuildEmoji object. This can be:
   * * A custom emoji ID
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
      if (!emoji.includes('%')) return encodeURIComponent(emoji);
      else return emoji;
    }
    return null;
  }
}

module.exports = GuildEmojiStore;
