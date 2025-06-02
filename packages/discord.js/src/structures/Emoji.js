'use strict';

const { formatEmoji } = require('@discordjs/formatters');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Base } = require('./Base.js');

/**
 * Represents an emoji, see {@link ApplicationEmoji}, {@link GuildEmoji} and {@link ReactionEmoji}.
 *
 * @extends {Base}
 */
class Emoji extends Base {
  constructor(client, emoji) {
    super(client);
    /**
     * Whether or not the emoji is animated
     *
     * @type {?boolean}
     */
    this.animated = emoji.animated ?? null;

    /**
     * The emoji's name
     *
     * @type {?string}
     */
    this.name = emoji.name ?? null;

    /**
     * The emoji's id
     *
     * @type {?Snowflake}
     */
    this.id = emoji.id ?? null;
  }

  /**
   * The identifier of this emoji, used for message reactions
   *
   * @type {string}
   * @readonly
   */
  get identifier() {
    if (this.id) return `${this.animated ? 'a:' : ''}${this.name}:${this.id}`;
    return encodeURIComponent(this.name);
  }

  /**
   * Returns a URL for the emoji or `null` if this is not a custom emoji.
   *
   * @param {EmojiURLOptions} [options={}] Options for the emoji URL
   * @returns {?string}
   */
  imageURL(options = {}) {
    if (!this.id) return null;

    // Return a dynamic extension depending on whether the emoji is animated.
    const resolvedOptions = { extension: options.extension, size: options.size };

    if (!options.extension || options.extension === 'webp') {
      resolvedOptions.animated = options.animated ?? (this.animated || undefined);
    }

    return this.client.rest.cdn.emoji(this.id, resolvedOptions);
  }

  /**
   * The timestamp the emoji was created at, or null if unicode
   *
   * @type {?number}
   * @readonly
   */
  get createdTimestamp() {
    return this.id && DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the emoji was created at, or null if unicode
   *
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    return this.id && new Date(this.createdTimestamp);
  }

  /**
   * When concatenated with a string, this automatically returns the text required to form a graphical emoji on Discord
   * instead of the Emoji object.
   *
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
    return this.id ? formatEmoji({ animated: this.animated, id: this.id, name: this.name }) : this.name;
  }

  toJSON() {
    const json = super.toJSON({
      guild: 'guildId',
      createdTimestamp: true,
      identifier: true,
    });
    json.imageURL = this.imageURL();
    return json;
  }
}

exports.Emoji = Emoji;
