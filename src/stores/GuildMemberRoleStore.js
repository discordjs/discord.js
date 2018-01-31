const DataStore = require('./DataStore');
const Role = require('../structures/Role');
const Collection = require('../util/Collection');
const { TypeError } = require('../errors');

/**
 * Stores member roles
 * @extends {DataStore}
 */
class GuildMemberRoleStore extends DataStore {
  constructor(member) {
    super(member.client, null, Role);
    this.member = member;
    this.guild = member.guild;
  }

  /**
   * Adds a role (or multiple roles) to the member.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to add
   * @param {string} [reason] Reason for adding the role(s)
   * @returns {Promise<GuildMember>}
   */
  add(roleOrRoles, reason) {
    if (roleOrRoles instanceof Collection) return this.add(roleOrRoles.keyArray(), reason);
    if (!(roleOrRoles instanceof Array)) return this.add([roleOrRoles], reason);

    roleOrRoles = roleOrRoles.map(r => this.guild.roles.resolve(r));

    if (roleOrRoles.includes(null)) {
      return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
        'Array or Collection of Roles or Snowflakes', true));
    } else {
      for (const role of roleOrRoles) super.set(role.id, role);
    }

    return this.set(this, reason);
  }

  /**
   * Sets the roles applied to the member.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to apply
   * @param {string} [reason] Reason for applying the roles
   * @returns {Promise<GuildMember>}
   * @example
   * // Set the member's roles to a single role
   * guildMember.roles.set(['391156570408615936'])
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Remove all the roles from a member
   * guildMember.roles.set([])
   *   .then(member => console.log(`Member roles is now of ${member.roles.size} size`))
   *   .catch(console.error);
   */
  set(roles, reason) {
    return this.member.edit({ roles }, reason);
  }

  /**
   * Removes a role (or multiple roles) from the member.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to remove
   * @param {string} [reason] Reason for removing the role(s)
   * @returns {Promise<GuildMember>}
   */
  remove(roleOrRoles, reason) {
    if (roleOrRoles instanceof Collection) return this.remove(roleOrRoles.keyArray(), reason);
    if (!(roleOrRoles instanceof Array)) return this.remove([roleOrRoles], reason);

    roleOrRoles = roleOrRoles.map(r => this.guild.roles.resolveID(r));

    if (roleOrRoles.includes(null)) {
      return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
        'Array or Collection of Roles or Snowflakes', true));
    } else {
      for (const role of roleOrRoles) super.remove(role);
    }

    return this.set(this, reason);
  }

  /**
   * The role of the member used to hoist them in a separate category in the users list
   * @type {?Role}
   * @readonly
   */
  get hoist() {
    const hoistedRoles = this.filter(role => role.hoist);
    if (!hoistedRoles.size) return null;
    return hoistedRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The role of the member used to set their color
   * @type {?Role}
   * @readonly
   */
  get color() {
    const coloredRoles = this.filter(role => role.color);
    if (!coloredRoles.size) return null;
    return coloredRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The role of the member with the highest position
   * @type {Role}
   * @readonly
   */
  get highest() {
    return this.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * Patches the roles for this store
   * @param {Snowflake[]} roles The new roles
   * @private
   */
  _patch(roles) {
    this.clear();

    const everyoneRole = this.guild.roles.get(this.guild.id);
    if (everyoneRole) super.set(everyoneRole.id, everyoneRole);

    if (roles) {
      for (const roleID of roles) {
        const role = this.guild.roles.resolve(roleID);
        if (role) super.set(role.id, role);
      }
    }
  }

  clone() {
    const clone = new this.constructor(this.member);
    clone._patch(this.keyArray());
    return clone;
  }

  /**
   * Resolves a RoleResolvable to a Role object.
   * @method resolve
   * @memberof GuildMemberRoleStore
   * @instance
   * @param {RoleResolvable} role The role resolvable to resolve
   * @returns {?Role}
   */

  /**
   * Resolves a RoleResolvable to a role ID string.
   * @method resolveID
   * @memberof GuildMemberRoleStore
   * @instance
   * @param {RoleResolvable} role The role resolvable to resolve
   * @returns {?Snowflake}
   */
}

module.exports = GuildMemberRoleStore;
