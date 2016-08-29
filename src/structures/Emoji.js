const Collection = require('../util/Collection');
const Constants = require('../util/Constants');

/**
 * Represents a Custom Emoji
 */
class Emoji {
  constructor(guild, data) {
    /**
     * The Client that instantiated this object
     * @type {Client}
     */
    this.client = guild.client;
    /**
     * The Guild this emoji is part of
     * @type {Guild}
     */
    this.guild = guild;
    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of the Emoji
     * @type {String}
     */
    this.id = data.id;
    /**
     * The name of the Emoji
     * @type {String}
     */
    this.name = data.name;
    this.roleIDS = data.roles;
    /**
     * Whether or not this emoji requires colons surrounding it
     * @type {Boolean}
     */
    this.requiresColons = data.require_colons;
    /**
     * Whether this emoji is managed by an external service
     * @type {Boolean}
     */
    this.managed = data.managed;
  }

  /**
   * A collection of roles this emoji is active for (empty if all). Mapped by role ID.
   * @type {Collection<String, Role>}
   * @readonly
   */
  get roles() {
    const roles = new Collection();
    for (const role of this.roleIDS) {
      if (this.guild.roles.get(role)) {
        roles.set(role, this.guild.roles.get(role));
      }
    }
    return roles;
  }

  /**
   * The URL to the emoji file
   * @type {String}
   * @readonly
   */
  get url() {
    return `${Constants.Endpoints.CDN}/emojis/${this.id}.png`;
  }

  /**
   * When concatenated with a String, this automatically returns the emoji mention rather than the object.
   * @returns {String}
   * @example
   * // send an emoji:
   * const emoji = guild.emojis.array()[0];
   * msg.reply(`Hello! ${emoji}`);
   */
  toString() {
    return this.requiresColons ? `<:${this.name}:${this.id}>` : this.name;
  }
}

module.exports = Emoji;
