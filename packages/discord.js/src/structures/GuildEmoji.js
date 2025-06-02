'use strict';

const { PermissionFlagsBits } = require('discord-api-types/v10');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');
const { GuildEmojiRoleManager } = require('../managers/GuildEmojiRoleManager.js');
const { BaseGuildEmoji } = require('./BaseGuildEmoji.js');

/**
 * Represents a custom emoji.
 *
 * @extends {BaseGuildEmoji}
 */
class GuildEmoji extends BaseGuildEmoji {
  constructor(client, data, guild) {
    super(client, data, guild);

    /**
     * The user who created this emoji
     *
     * @type {?User}
     */
    this.author = null;

    /**
     * Array of role ids this emoji is active for
     *
     * @name GuildEmoji#_roles
     * @type {Snowflake[]}
     * @private
     */
    Object.defineProperty(this, '_roles', { value: [], writable: true });

    this._patch(data);
  }

  /**
   * The guild this emoji is part of
   *
   * @type {Guild}
   * @name GuildEmoji#guild
   */

  _clone() {
    const clone = super._clone();
    clone._roles = this._roles.slice();
    return clone;
  }

  _patch(data) {
    super._patch(data);

    if (data.user) this.author = this.client.users._add(data.user);
    if (data.roles) this._roles = data.roles;
  }

  /**
   * Whether the emoji is deletable by the client user
   *
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    if (!this.guild.members.me) throw new DiscordjsError(ErrorCodes.GuildUncachedMe);
    return !this.managed && this.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuildExpressions);
  }

  /**
   * A manager for roles this emoji is active for.
   *
   * @type {GuildEmojiRoleManager}
   * @readonly
   */
  get roles() {
    return new GuildEmojiRoleManager(this);
  }

  /**
   * Fetches the author for this emoji
   *
   * @returns {Promise<User>}
   */
  async fetchAuthor() {
    return this.guild.emojis.fetchAuthor(this);
  }

  /**
   * Data for editing an emoji.
   *
   * @typedef {Object} GuildEmojiEditOptions
   * @property {string} [name] The name of the emoji
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] Roles to restrict emoji to
   * @property {string} [reason] Reason for editing this emoji
   */

  /**
   * Edits the emoji.
   *
   * @param {GuildEmojiEditOptions} options The options to provide
   * @returns {Promise<GuildEmoji>}
   * @example
   * // Edit an emoji
   * emoji.edit({ name: 'newemoji' })
   *   .then(emoji => console.log(`Edited emoji ${emoji}`))
   *   .catch(console.error);
   */
  async edit(options) {
    return this.guild.emojis.edit(this.id, options);
  }

  /**
   * Sets the name of the emoji.
   *
   * @param {string} name The new name for the emoji
   * @param {string} [reason] Reason for changing the emoji's name
   * @returns {Promise<GuildEmoji>}
   */
  async setName(name, reason) {
    return this.edit({ name, reason });
  }

  /**
   * Deletes the emoji.
   *
   * @param {string} [reason] Reason for deleting the emoji
   * @returns {Promise<GuildEmoji>}
   */
  async delete(reason) {
    await this.guild.emojis.delete(this.id, reason);
    return this;
  }

  /**
   * Whether this emoji is the same as another one.
   *
   * @param {GuildEmoji|APIEmoji} other The emoji to compare it to
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof GuildEmoji) {
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

exports.GuildEmoji = GuildEmoji;
