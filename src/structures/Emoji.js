'use strict';

const Snowflake = require('../util/Snowflake');
const Base = require('./Base');


/**
 * Represents an emoji, see {@link GuildEmoji} and {@link ReactionEmoji}.
 * @extends {Base}
 */
class Emoji extends Base {
  constructor(client, emoji) {
    super(client);
    /**
     * Whether this emoji is animated
     * @type {boolean}
     */
    this.animated = emoji.animated;

    /**
     * The name of this emoji
     * @type {string}
     */
    this.name = emoji.name;

    /**
     * The ID of this emoji
     * @type {?Snowflake}
     */
    this.id = emoji.id;

    /**
     * Whether this emoji has been deleted
     * @type {boolean}
     */
    this.deleted = false;
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
   * The URL to the emoji file if its a custom emoji
   * @type {?string}
   * @readonly
   */
  get url() {
    if (!this.id) return null;
    return this.client.rest.cdn.Emoji(this.id, this.animated ? 'gif' : 'png');
  }

  /**
   * The timestamp the emoji was created at, or null if unicode
   * @type {?number}
   * @readonly
   */
  get createdTimestamp() {
    if (!this.id) return null;
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the emoji was created at, or null if unicode
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    if (!this.id) return null;
    return new Date(this.createdTimestamp);
  }

  /**
   * When concatenated with a string, this automatically returns the text required to form a graphical emoji on Discord
   * instead of the Emoji object.
   * @returns {string}
   * @example
   * // Send a custom emoji from a guild:
   * const emoji = guild.emojis.first();
   * msg.reply(`Hello! ${emoji}`);
   * @example
   * // Send the emoji used in a reaction to the channel the reaction is part of
   * reaction.message.channel.send(`The emoji used was: ${reaction.emoji}`);
   */
  toString() {
    return this.id ? `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>` : this.name;
  }

  toJSON() {
    return super.toJSON({
      guild: 'guildID',
      createdTimestamp: true,
      url: true,
      identifier: true,
    });
  }
}

module.exports = Emoji;
