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
   * Function that does exactly the same as Map#set
   * but it is overwritten for this DataStore due to {@link GuildMemberRoleStore#set}
   * @private
   * @param {Snowflake} id The role ID
   * @param {Role} role The role object
   * @returns {GuildMemberRoleStore} The updated store
   */
  _set(id, role) {
    return super.set(id, role);
  }

  /**
   * Adds a role (or multiple roles) to the member
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to add
   * @param {string} [reason] Reason for adding the role(s)
   * @returns {Promise<GuildMember>}
   */
  add(roleOrRoles, reason) {
    if (this.resolve(roleOrRoles)) {
      return this._addOne(roleOrRoles, reason);
    } else {
      return this._addMany(roleOrRoles, reason);
    }
  }

  /**
   * Adds a single role to the member
   * @param {RoleResolvable} role The role or role ID to add
   * @param {string} [reason] Reason for adding the role
   * @private
   * @returns {Promise<GuildMember>}
   */
  _addOne(role, reason) {
    role = this.resolve(role);
    if (!role) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
    if (this.member._roles.includes(role.id)) return Promise.resolve(this.member);
    return this.client.api.guilds(this.guild.id).members(this.member.id).roles(role.id)
      .put({ reason })
      .then(() => {
        const clone = this.member._clone();
        if (!clone._roles.includes(role.id)) clone._roles.push(role.id);
        return clone;
      });
  }

  /**
   * Adds multiple roles to the member.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to add
   * @param {string} [reason] Reason for adding the roles
   * @private
   * @returns {Promise<GuildMember>}
   */
  _addMany(roles, reason) {
    let allRoles = this.member._roles.slice();
    for (let role of roles instanceof Collection ? roles.values() : roles) {
      role = this.resolve(role);
      if (!role) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      if (!allRoles.includes(role.id)) allRoles.push(role.id);
    }
    return this.member.edit({ roles: allRoles }, reason);
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
   * Removes a role (or multiple roles) from the member
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to remove
   * @param {string} [reason] Reason for removing the role(s)
   * @returns {Promise<GuildMember>}
   */
  remove(roleOrRoles, reason) {
    if (this.resolve(roleOrRoles)) {
      return this._removeOne(roleOrRoles, reason);
    } else {
      return this._removeMany(roleOrRoles, reason);
    }
  }

  /**
   * Removes a single role from the member.
   * @param {RoleResolvable} role The role or ID of the role to remove
   * @param {string} [reason] Reason for removing the role
   * @private
   * @returns {Promise<GuildMember>}
   */
  _removeOne(role, reason) {
    role = this.resolve(role);
    if (!role) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
    if (!this.member._roles.includes(role.id)) return Promise.resolve(this);
    return this.client.api.guilds(this.guild.id).members(this.member.id).roles(role.id)
      .delete({ reason })
      .then(() => {
        const clone = this.member._clone();
        const index = clone._roles.indexOf(role.id);
        if (~index) clone._roles.splice(index, 1);
        return clone;
      });
  }

  /**
   * Removes multiple roles from the member.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to remove
   * @param {string} [reason] Reason for removing the roles
   * @private
   * @returns {Promise<GuildMember>}
   */
  _removeMany(roles, reason) {
    const allRoles = this.member._roles.slice();
    for (let role of roles instanceof Collection ? roles.values() : roles) {
      role = this.resolve(role);
      if (!role) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      const index = allRoles.indexOf(role.id);
      if (index >= 0) allRoles.splice(index, 1);
    }
    return this.member.edit({ roles: allRoles }, reason);
  }

  /**
   * The role of the member used to hoist them in a separate category in the users list
   * @type {?Role}
   * @readonly
   */
  get hoistRole() {
    const hoistedRoles = this.filter(role => role.hoist);
    if (!hoistedRoles.size) return null;
    return hoistedRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The role of the member used to set their color
   * @type {?Role}
   * @readonly
   */
  get colorRole() {
    const coloredRoles = this.filter(role => role.color);
    if (!coloredRoles.size) return null;
    return coloredRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The role of the member with the highest position
   * @type {Role}
   * @readonly
   */
  get highestRole() {
    return this.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  resolve(idOrInstance) {
    return this.guild.roles.resolve(idOrInstance);
  }

  resolveID(idOrInstance) {
    return this.guild.roles.resolveID(idOrInstance);
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
