const DataStore = require('./DataStore');
const Collection = require('../util/Collection');
const { TypeError } = require('../errors');

/**
 * Stores emoji roles
 * @extends {DataStore}
 */
class GuildEmojiRoleStore extends DataStore {
  constructor(emoji) {
    super(emoji.client, null, require('../structures/GuildEmoji'));
    this.emoji = emoji;
    this.guild = emoji.guild;
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
    const newRoles = [...new Set(roleOrRoles.concat(this.array()))];
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
    clone._patch(this.keyArray());
    return clone;
  }

  /**
   * Patches the roles for this store
   * @param {Snowflake[]} roles The new roles
   * @private
   */
  _patch(roles) {
    this.clear();

    for (let role of roles) {
      role = this.guild.roles.resolve(role);
      if (role) super.set(role.id, role);
    }
  }

  /**
   * Resolves a RoleResolvable to a Role object.
   * @method resolve
   * @memberof GuildEmojiRoleStore
   * @instance
   * @param {RoleResolvable} role The role resolvable to resolve
   * @returns {?Role}
   */

  /**
   * Resolves a RoleResolvable to a role ID string.
   * @method resolveID
   * @memberof GuildEmojiRoleStore
   * @instance
   * @param {RoleResolvable} role The role resolvable to resolve
   * @returns {?Snowflake}
   */
}

module.exports = GuildEmojiRoleStore;
