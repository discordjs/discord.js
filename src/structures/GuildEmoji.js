const GuildEmojiRoleStore = require('../stores/GuildEmojiRoleStore');
const Permissions = require('../util/Permissions');
const { Error } = require('../errors');
const Emoji = require('./Emoji');

/**
 * Represents a custom emoji.
 * @extends {Emoji}
 */
class GuildEmoji extends Emoji {
  constructor(client, data, guild) {
    super(client, data);

    /**
     * The guild this emoji is part of
     * @type {Guild}
     */
    this.guild = guild;

    this._roles = [];
    this._patch(data);
  }

  _patch(data) {
    if (data.name) this.name = data.name;

    /**
     * Whether or not this emoji requires colons surrounding it
     * @type {boolean}
     */
    if (typeof data.require_colons !== 'undefined') this.requiresColons = data.require_colons;

    /**
     * Whether this emoji is managed by an external service
     * @type {boolean}
     */
    if (typeof data.managed !== 'undefined') this.managed = data.managed;

    if (data.roles) this._roles = data.roles;
  }

  _clone() {
    const clone = super._clone();
    clone._roles = this._roles.slice();
    return clone;
  }

  /**
   * Whether the emoji is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return !this.managed &&
      this.guild.me.hasPermission(Permissions.FLAGS.MANAGE_EMOJIS);
  }

  /**
   * A collection of roles this emoji is active for (empty if all), mapped by role ID
   * @type {GuildEmojiRoleStore<Snowflake, Role>}
   * @readonly
   */
  get roles() {
    return new GuildEmojiRoleStore(this);
  }

  /**
   * Fetches the author for this emoji
   * @returns {Promise<User>}
   */
  fetchAuthor() {
    if (this.managed) {
      return Promise.reject(new Error('EMOJI_MANAGED'));
    } else if (!this.guild.me.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS)) {
      return Promise.reject(new Error('MISSING_MANAGE_EMOJIS_PERMISSION', this.guild));
    }
    return this.client.api.guilds(this.guild.id).emojis(this.id).get()
      .then(emoji => this.client.users.add(emoji.user));
  }

  /**
   * Data for editing an emoji.
   * @typedef {Object} GuildEmojiEditData
   * @property {string} [name] The name of the emoji
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] Roles to restrict emoji to
   */

  /**
   * Edits the emoji.
   * @param {GuildEmojiEditData} data The new data for the emoji
   * @param {string} [reason] Reason for editing this emoji
   * @returns {Promise<GuildEmoji>}
   * @example
   * // Edit an emoji
   * emoji.edit({ name: 'newemoji' })
   *   .then(e => console.log(`Edited emoji ${e}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    const roles = data.roles ? data.roles.map(r => r.id || r) : undefined;
    return this.client.api.guilds(this.guild.id).emojis(this.id)
      .patch({ data: {
        name: data.name,
        roles,
      }, reason })
      .then(newData => {
        const clone = this._clone();
        clone._patch(newData);
        return clone;
      });
  }

  /**
   * Sets the name of the emoji.
   * @param {string} name The new name for the emoji
   * @param {string} [reason] Reason for changing the emoji's name
   * @returns {Promise<GuildEmoji>}
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Deletes the emoji.
   * @param {string} [reason] Reason for deleting the emoji
   * @returns {Promise<GuildEmoji>}
   */
  delete(reason) {
    return this.client.api.guilds(this.guild.id).emojis(this.id).delete({ reason })
      .then(() => this);
  }

  /**
   * Whether this emoji is the same as another one.
   * @param {GuildEmoji|Object} other The emoji to compare it to
   * @returns {boolean} Whether the emoji is equal to the given emoji or not
   */
  equals(other) {
    if (other instanceof GuildEmoji) {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other.managed === this.managed &&
        other.requiresColons === this.requiresColons &&
        other.roles.size === this.roles.size &&
        other.roles.every(role => this.roles.has(role.id))
      );
    } else {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other.roles.length === this.roles.size &&
        other.roles.every(role => this.roles.has(role))
      );
    }
  }
}

module.exports = GuildEmoji;
