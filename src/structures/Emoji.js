const Constants = require('../util/Constants');
const Collection = require('../util/Collection');

/**
 * Represents a custom emoji
 */
class Emoji {
  constructor(guild, data) {
    /**
     * The Client that instantiated this object
     * @name Emoji#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: guild.client });

    /**
     * The guild this emoji is part of
     * @type {Guild}
     */
    this.guild = guild;

    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of the emoji
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the emoji
     * @type {string}
     */
    this.name = data.name;

    /**
     * Whether or not this emoji requires colons surrounding it
     * @type {boolean}
     */
    this.requiresColons = data.require_colons;

    /**
     * Whether this emoji is managed by an external service
     * @type {boolean}
     */
    this.managed = data.managed;

    this._roles = data.roles;
  }

  /**
   * The timestamp the emoji was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return (this.id / 4194304) + 1420070400000;
  }

  /**
   * The time the emoji was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A collection of roles this emoji is active for (empty if all), mapped by role ID.
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get roles() {
    const roles = new Collection();
    for (const role of this._roles) {
      if (this.guild.roles.has(role)) roles.set(role, this.guild.roles.get(role));
    }
    return roles;
  }

  /**
   * The URL to the emoji file
   * @type {string}
   * @readonly
   */
  get url() {
    return Constants.Endpoints.emoji(this.id);
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
   * Data for editing an emoji
   * @typedef {Object} EmojiEditData
   * @property {string} [name] The name of the emoji
   * @property {Collection<string, Role>|Array<string|Role>} [roles] Roles to restrict emoji to
   */

  /**
   * Edits the emoji
   * @param {EmojiEditData} data The new data for the emoji
   * @returns {Promise<Emoji>}
   * @example
   * // edit a emoji
   * emoji.edit({name: 'newemoji'})
   *  .then(e => console.log(`Edited emoji ${e}`))
   *  .catch(console.error);
   */
  edit(data) {
    return this.client.rest.methods.updateEmoji(this, data);
  }

  /**
   * When concatenated with a string, this automatically returns the emoji mention rather than the object.
   * @returns {string}
   * @example
   * // send an emoji:
   * const emoji = guild.emojis.first();
   * msg.reply(`Hello! ${emoji}`);
   */
  toString() {
    return this.requiresColons ? `<:${this.name}:${this.id}>` : this.name;
  }

  /**
   * Whether this emoji is the same as another one
   * @param {Emoji|Object} other the emoji to compare it to
   * @returns {boolean} whether the emoji is equal to the given emoji or not
   */
  equals(other) {
    if (other instanceof Emoji) {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other.managed === this.managed &&
        other.requiresColons === this.requiresColons
      );
    } else {
      return (
        other.id === this.id &&
        other.name === this.name
      );
    }
  }
}

module.exports = Emoji;
