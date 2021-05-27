'use strict';

const { TypeError } = require('../errors');
const Collection = require('../util/Collection');

/**
 * Manages API methods for roles belonging to emojis and stores their cache.
 */
class GuildEmojiRoleManager {
  constructor(emoji) {
    /**
     * The emoji belonging to this manager
     * @type {GuildEmoji}
     */
    this.emoji = emoji;
    /**
     * The guild belonging to this manager
     * @type {Guild}
     */
    this.guild = emoji.guild;
    /**
     * The client belonging to this manager
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: emoji.client });
  }

  /**
   * The filtered collection of roles of the guild emoji
   * @type {Collection<Snowflake, Role>}
   * @private
   * @readonly
   */
  get _roles() {
    return this.guild.roles.cache.filter(role => this.emoji._roles.includes(role.id));
  }

  /**
   * The cache of roles belonging to this emoji
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get cache() {
    return this._roles;
  }

  /**
   * Adds a role (or multiple roles) to the list of roles that can use this emoji.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to add
   * @returns {Promise<GuildEmoji>}
   */
  add(roleOrRoles) {
    if (!Array.isArray(roleOrRoles) && !(roleOrRoles instanceof Collection)) roleOrRoles = [roleOrRoles];

    const resolvedRoles = [];
    for (const role of roleOrRoles.values()) {
      const resolvedRole = this.guild.roles.resolveID(role);
      if (!resolvedRole) {
        return Promise.reject(new TypeError('INVALID_ELEMENT', 'Array or Collection', 'roles', role));
      }
      resolvedRoles.push(resolvedRole);
    }

    const newRoles = [...new Set(resolvedRoles.concat(...this._roles.values()))];
    return this.set(newRoles);
  }

  /**
   * Removes a role (or multiple roles) from the list of roles that can use this emoji.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to remove
   * @returns {Promise<GuildEmoji>}
   */
  remove(roleOrRoles) {
    if (!Array.isArray(roleOrRoles) && !(roleOrRoles instanceof Collection)) roleOrRoles = [roleOrRoles];

    const resolvedRoles = [];
    for (const role of roleOrRoles.values()) {
      const resolvedRole = this.guild.roles.resolveID(role);
      if (!resolvedRole) {
        return Promise.reject(new TypeError('INVALID_ELEMENT', 'Array or Collection', 'roles', role));
      }
      resolvedRoles.push(resolvedRole);
    }

    const newRoles = this._roles.keyArray().filter(role => !resolvedRoles.includes(role.id));
    return this.set(newRoles);
  }

  /**
   * Sets the role(s) that can use this emoji.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to apply
   * @returns {Promise<GuildEmoji>}
   * @example
   * // Set the emoji's roles to a single role
   * guildEmoji.roles.set(['391156570408615936'])
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Remove all roles from an emoji
   * guildEmoji.roles.set([])
   *    .then(console.log)
   *    .catch(console.error);
   */
  set(roles) {
    return this.emoji.edit({ roles });
  }

  clone() {
    const clone = new this.constructor(this.emoji);
    clone._patch(this._roles.keyArray().slice());
    return clone;
  }

  /**
   * Patches the roles for this manager's cache
   * @param {Snowflake[]} roles The new roles
   * @private
   */
  _patch(roles) {
    this.emoji._roles = roles;
  }

  valueOf() {
    return this.cache;
  }
}

module.exports = GuildEmojiRoleManager;
