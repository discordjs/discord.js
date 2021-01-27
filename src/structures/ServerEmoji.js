'use strict';

const BaseServerEmoji = require('./BaseServerEmoji');
const { Error } = require('../errors');
const ServerEmojiRoleManager = require('../managers/ServerEmojiRoleManager');
const Permissions = require('../util/Permissions');

/**
 * Represents a custom emoji.
 * @extends {BaseServerEmoji}
 */
class ServerEmoji extends BaseServerEmoji {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the server emoji
   * @param {Server} server The server the server emoji is part of
   */
  constructor(client, data, server) {
    super(client, data, server);

    /**
     * The user who created this emoji
     * @type {?User}
     */
    this.author = null;
  }

  /**
   * The server this emoji is part of
   * @type {Server}
   * @name ServerEmoji#server
   */

  _clone() {
    const clone = super._clone();
    clone._roles = this._roles.slice();
    return clone;
  }

  _patch(data) {
    super._patch(data);
    if (typeof data.user !== 'undefined') this.author = this.client.users.add(data.user);
  }

  /**
   * Whether the emoji is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    if (!this.server.me) throw new Error('GUILD_UNCACHED_ME');
    return !this.managed && this.server.me.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS);
  }

  /**
   * A manager for roles this emoji is active for.
   * @type {ServerEmojiRoleManager}
   * @readonly
   */
  get roles() {
    return new ServerEmojiRoleManager(this);
  }

  /**
   * Fetches the author for this emoji
   * @returns {Promise<User>}
   */
  async fetchAuthor() {
    if (this.managed) {
      throw new Error('EMOJI_MANAGED');
    } else {
      if (!this.server.me) throw new Error('GUILD_UNCACHED_ME');
      if (!this.server.me.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS)) {
        throw new Error('MISSING_MANAGE_EMOJIS_PERMISSION', this.server);
      }
    }
    const data = await this.client.api.servers(this.server.id).emojis(this.id).get();
    this._patch(data);
    return this.author;
  }

  /**
   * Data for editing an emoji.
   * @typedef {Object} ServerEmojiEditData
   * @property {string} [name] The name of the emoji
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] Roles to restrict emoji to
   */

  /**
   * Edits the emoji.
   * @param {ServerEmojiEditData} data The new data for the emoji
   * @param {string} [reason] Reason for editing this emoji
   * @returns {Promise<ServerEmoji>}
   * @example
   * // Edit an emoji
   * emoji.edit({ name: 'newemoji' })
   *   .then(e => console.log(`Edited emoji ${e}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    const roles = data.roles ? data.roles.map(r => r.id || r) : undefined;
    return this.client.api
      .servers(this.server.id)
      .emojis(this.id)
      .patch({
        data: {
          name: data.name,
          roles,
        },
        reason,
      })
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
   * @returns {Promise<ServerEmoji>}
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Deletes the emoji.
   * @param {string} [reason] Reason for deleting the emoji
   * @returns {Promise<ServerEmoji>}
   */
  delete(reason) {
    return this.client.api
      .servers(this.server.id)
      .emojis(this.id)
      .delete({ reason })
      .then(() => this);
  }

  /**
   * Whether this emoji is the same as another one.
   * @param {ServerEmoji|Object} other The emoji to compare it to
   * @returns {boolean} Whether the emoji is equal to the given emoji or not
   */
  equals(other) {
    if (other instanceof ServerEmoji) {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other.managed === this.managed &&
        other.available === this.available &&
        other.requiresColons === this.requiresColons &&
        other.roles.cache.size === this.roles.cache.size &&
        other.roles.cache.every(role => this.roles.cache.has(role.id))
      );
    } else {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other.roles.length === this.roles.cache.size &&
        other.roles.every(role => this.roles.cache.has(role))
      );
    }
  }
}

module.exports = ServerEmoji;
