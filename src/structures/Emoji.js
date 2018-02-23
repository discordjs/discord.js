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

  /**
   * Deletes the emoji.
   * @param {string} [reason] Reason for deleting the emoji
   * @returns {Promise<Emoji>}
   */
  delete(reason) {
    return this.client.api.guilds(this.guild.id).emojis(this.id).delete({ reason })
      .then(() => this);
  }

  /**
   * Whether this emoji is the same as another one.
   * @param {Emoji|Object} other The emoji to compare it to
   * @returns {boolean} Whether the emoji is equal to the given emoji or not
   */
  equals(other) {
    if (other instanceof Emoji) {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other.managed === this.managed &&
        other.requiresColons === this.requiresColons &&
        other._roles === this._roles
      );
    } else {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other._roles === this._roles
      );
    }
  }
}

module.exports = Emoji;
