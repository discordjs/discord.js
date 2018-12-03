'use strict';

const Collection = require('../util/Collection');
const Util = require('../util/Util');
const { TypeError } = require('../errors');

/**
 * Stores emoji roles
 * @extends {Collection}
 */
class GuildEmojiRoleStore extends Collection {
  constructor(emoji) {
    super();
    this.emoji = emoji;
    this.guild = emoji.guild;
    Object.defineProperty(this, 'client', { value: emoji.client });
  }

  /**
   * The filtered collection of roles of the guild emoji
   * @type {Collection<Snowflake, Role>}
   * @private
   */
  get _filtered() {
    return this.guild.roles.filter(role => this.emoji._roles.includes(role.id));
  }

  /**
   * Adds a role (or multiple roles) to the list of roles that can use this emoji.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to add
   * @returns {Promise<GuildEmoji>}
   */
  add(roleOrRoles) {
    if (roleOrRoles instanceof Collection) return this.add(roleOrRoles.keyArray());
    if (!(roleOrRoles instanceof Array)) return this.add([roleOrRoles]);
    roleOrRoles = roleOrRoles.map(r => this.guild.roles.resolve(r));

    if (roleOrRoles.includes(null)) {
      return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
        'Array or Collection of Roles or Snowflakes', true));
    }

    const newRoles = [...new Set(roleOrRoles.concat(...this.values()))];
    return this.set(newRoles);
  }

  /**
   * Removes a role (or multiple roles) from the list of roles that can use this emoji.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to remove
   * @returns {Promise<GuildEmoji>}
   */
  remove(roleOrRoles) {
    if (roleOrRoles instanceof Collection) return this.remove(roleOrRoles.keyArray());
    if (!(roleOrRoles instanceof Array)) return this.remove([roleOrRoles]);
    roleOrRoles = roleOrRoles.map(r => this.guild.roles.resolveID(r));

    if (roleOrRoles.includes(null)) {
      return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
        'Array or Collection of Roles or Snowflakes', true));
    }

    const newRoles = this.keyArray().filter(role => !roleOrRoles.includes(role));
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
    clone._patch(this.keyArray().slice());
    return clone;
  }

  /**
   * Patches the roles for this store
   * @param {Snowflake[]} roles The new roles
   * @private
   */
  _patch(roles) {
    this.emoji._roles = roles;
  }

  *[Symbol.iterator]() {
    yield* this._filtered.entries();
  }

  valueOf() {
    return this._filtered;
  }
}

Util.mixin(GuildEmojiRoleStore, ['set']);

module.exports = GuildEmojiRoleStore;
