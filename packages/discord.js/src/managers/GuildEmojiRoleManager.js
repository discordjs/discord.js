'use strict';

const { Collection } = require('@discordjs/collection');
const { DataManager } = require('./DataManager.js');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');
const { Role } = require('../structures/Role.js');

/**
 * Manages API methods for roles belonging to emojis and stores their cache.
 * @extends {DataManager}
 */
class GuildEmojiRoleManager extends DataManager {
  constructor(emoji) {
    super(emoji.client, Role);

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
  }

  /**
   * The cache of roles belonging to this emoji
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get cache() {
    return this.guild.roles.cache.filter(role => this.emoji._roles.includes(role.id));
  }

  /**
   * Adds a role (or multiple roles) to the list of roles that can use this emoji.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to add
   * @returns {Promise<GuildEmoji>}
   */
  async add(roleOrRoles) {
    const roles = Array.isArray(roleOrRoles) || roleOrRoles instanceof Collection ? roleOrRoles : [roleOrRoles];

    const resolvedRoleIds = [];
    for (const role of roles.values()) {
      const roleId = this.guild.roles.resolveId(role);
      if (!roleId) {
        throw new DiscordjsTypeError(ErrorCodes.InvalidElement, 'Array or Collection', 'roles', role);
      }
      resolvedRoleIds.push(roleId);
    }

    const newRoles = [...new Set(resolvedRoleIds.concat(...this.cache.keys()))];
    return this.set(newRoles);
  }

  /**
   * Removes a role (or multiple roles) from the list of roles that can use this emoji.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to remove
   * @returns {Promise<GuildEmoji>}
   */
  async remove(roleOrRoles) {
    const roles = Array.isArray(roleOrRoles) || roleOrRoles instanceof Collection ? roleOrRoles : [roleOrRoles];

    const resolvedRoleIds = [];
    for (const role of roles.values()) {
      const roleId = this.guild.roles.resolveId(role);
      if (!roleId) {
        throw new DiscordjsTypeError(ErrorCodes.InvalidElement, 'Array or Collection', 'roles', role);
      }
      resolvedRoleIds.push(roleId);
    }

    const newRoles = [...this.cache.keys()].filter(id => !resolvedRoleIds.includes(id));
    return this.set(newRoles);
  }

  /**
   * Sets the role(s) that can use this emoji.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role ids to apply
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
    clone._patch([...this.cache.keys()]);
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

exports.GuildEmojiRoleManager = GuildEmojiRoleManager;
