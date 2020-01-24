const Constants = require('../util/Constants');
const Snowflake = require('../util/Snowflake');

/**
 * Represents a limited emoji set used for both custom and unicode emojis. Custom emojis
 * will use this class opposed to the Emoji class when the client doesn't know enough
 * information about them.
 */
class ReactionEmoji {
  constructor(reaction, emoji) {
    /**
     * The client that instantiated this object
     * @name ReactionEmoji#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: reaction.message.client });

    /**
     * The message reaction this emoji refers to
     * @type {MessageReaction}
     */
    this.reaction = reaction;

    /**
     * The name of this reaction emoji
     * @type {string}
     */
    this.name = emoji.name;

    /**
     * The ID of this reaction emoji
     * @type {?Snowflake}
     */
    this.id = emoji.id;

    /**
     * Whether this reaction emoji is animated
     * @type {boolean}
     */
    this.animated = emoji.animated || false;
  }

  /**
   * The timestamp the reaction emoji was created at, or null if unicode
   * @type {?number}
   * @readonly
   */
  get createdTimestamp() {
    if (!this.id) return null;
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the reaction emoji was created, or null if unicode
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    if (!this.id) return null;
    return new Date(this.createdTimestamp);
  }

  /**
   * The URL to the reaction emoji file, or null if unicode
   * @type {string}
   * @readonly
   */
  get url() {
    if (!this.id) return null;
    return Constants.Endpoints.CDN(this.client.options.http.cdn).Emoji(this.id, this.animated ? 'gif' : 'png');
  }

  /**
   * The identifier of this emoji, used for message reactions
   * @type {string}
   * @readonly
   */
  get identifier() {
    if (this.id) return `${this.name}:${this.id}`;
    return encodeURIComponent(this.name);
  }

  /**
   * Creates the text required to form a graphical emoji on Discord.
   * @example
   * // Send the emoji used in a reaction to the channel the reaction is part of
   * reaction.message.channel.send(`The emoji used is ${reaction.emoji}`);
   * @returns {string}
   */
  toString() {
    if (!this.id) return this.name;

    return `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>`;
  }
}

module.exports = ReactionEmoji;
