const DataStore = require('./DataStore');
const Role = require('../structures/Role');
const Collection = require('../util/Collection');
const { TypeError } = require('../errors');

/**
 * Stores member roles
 * @extends {DataStore}
 */
class GuildMemberRoleStore extends DataStore {
  constructor(member, data) {
    super(member.client, null, Role);
    this.member = member;
    this.guild = member.guild;

    const everyoneRole = this.guild.roles.get(this.guild.id);
    if (everyoneRole) super.set(everyoneRole.id, everyoneRole);

    if (data) {
      for (const roleID of data) {
        const role = this.resolve(roleID);
        if (role) super.set(role.id, role);
      }
    }
  }

  /**
   * Adds a role (or multiple roles) to the member
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to add
   * @param {string} [reason] Reason for adding the role(s)
   * @returns {Promise<GuildMember>}
   */
  add(roleOrRoles, reason) {
    if (this.resolve(roleOrRoles)) {
      roleOrRoles = this.resolve(roleOrRoles);
      if (!roleOrRoles) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
      if (this._roles.includes(roleOrRoles.id)) return Promise.resolve(this.member);
      return this.client.api.guilds(this.guild.id).members(this.member.id).roles(roleOrRoles.id)
        .put({ reason })
        .then(() => {
          const clone = this.member._clone();
          if (!clone._roles.includes(roleOrRoles.id)) clone._roles.push(roleOrRoles.id);
          return clone;
        });
    } else {
      let allRoles = this.member._roles.slice();
      for (let role of roleOrRoles instanceof Collection ? roleOrRoles.values() : roleOrRoles) {
        role = this.resolve(role);
        if (!role) {
          return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
            'Array or Collection of Roles or Snowflakes', true));
        }
        if (!allRoles.includes(role.id)) allRoles.push(role.id);
      }
      return this.member.edit({ roles: allRoles }, reason);
    }
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
      roleOrRoles = this.resolve(roleOrRoles);
      if (!roleOrRoles) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
      if (!this.member._roles.includes(roleOrRoles.id)) return Promise.resolve(this);
      return this.client.api.guilds(this.guild.id).members(this.member.id).roles(roleOrRoles.id)
        .delete({ reason })
        .then(() => {
          const clone = this.member._clone();
          const index = clone._roles.indexOf(roleOrRoles.id);
          if (~index) clone._roles.splice(index, 1);
          return clone;
        });
    } else {
      const allRoles = this.member._roles.slice();
      for (let role of roleOrRoles instanceof Collection ? roleOrRoles.values() : roleOrRoles) {
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
