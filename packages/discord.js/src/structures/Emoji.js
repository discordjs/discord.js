'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const Base = require('./Base');

/**
 * Represents raw emoji data from the API
 * @typedef {APIEmoji} RawEmoji
 * @property {?Snowflake} id The emoji's id
 * @property {?string} name The emoji's name
 * @property {?boolean} animated Whether the emoji is animated
 */

/**
 * Represents an emoji, see {@link GuildEmoji} and {@link ReactionEmoji}.
 * @extends {Base}
 */
class Emoji extends Base {
  constructor(client, emoji) {
    super(client);
    /**
     * Whether or not the emoji is animated
     * @type {?boolean}
     */
    this.animated = emoji.animated ?? null;

    /**
     * The emoji's name
     * @type {?string}
     */
    this.name = emoji.name ?? null;

    /**
     * The emoji's id
     * @type {?Snowflake}
     */
    this.id = emoji.id;
  }

  /**
   * The identifier of this emoji, used for message reactions
   * @type {string}
   * @readonly
   */
  get identifier() {
    if (this.id) return `${this.animated ? 'a:' : ''}${this.name}:${this.id}`;
    return encodeURIComponent(this.name);
  }

/**
   * The URL to the emoji file if it's a custom emoji
   * @type {?string}
   * @param {ImageExtension} extension the extension of emoji
   * @returns {string}
   */
  url(extension) {
    let final_result;
    const extensions = ['webp', 'png', 'jpg', 'jpeg', 'gif'];
    if (!extensions.includes(extension)) extension = this.animated ? 'gif' : 'png';
    final_result = this.id && this.client.rest.cdn.emoji(this.id, extension);
    return final_result;
  }

  /**
   * The timestamp the emoji was created at, or null if unicode
   * @type {?number}
   * @readonly
   */
  get createdTimestamp() {
    return this.id && DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the emoji was created at, or null if unicode
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    return this.id && new Date(this.createdTimestamp);
  }

  /**
   * When concatenated with a string, this automatically returns the text required to form a graphical emoji on Discord
   * instead of the Emoji object.
   * @returns {string}
   * @example
   * // Send a custom emoji from a guild:
   * const emoji = guild.emojis.cache.first();
   * msg.channel.send(`Hello! ${emoji}`);
   * @example
   * // Send the emoji used in a reaction to the channel the reaction is part of
   * reaction.message.channel.send(`The emoji used was: ${reaction.emoji}`);
   */
  toString() {
    return this.id ? `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>` : this.name;
  }

  toJSON() {
    return super.toJSON({
      guild: 'guildId',
      createdTimestamp: true,
      url: true,
      identifier: true,
    });
  }
}

exports.Emoji = Emoji;

/**
 * @external APIEmoji
 * @see {@link https://discord.com/developers/docs/resources/emoji#emoji-object}
 */
