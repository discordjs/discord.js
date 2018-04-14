const Collection = require('../util/Collection');
const Util = require('../util/Util');
const { TypeError } = require('../errors');

/**
 * Stores member roles
 */
class GuildMemberRoleStore {
  constructor(member) {
    this.member = member;
    this.guild = member.guild;
    this.client = member.client;
  }

  /**
   * The filtered collection of roles of the member
   * @private
   */
  get _filtered() {
    return this.guild.roles.filter(role => this.member._roles.includes(role.id));
  }

  /**
   * The role of the member used to hoist them in a separate category in the users list
   * @type {?Role}
   * @readonly
   */
  get hoist() {
    const hoistedRoles = this._filtered.filter(role => role.hoist);
    if (!hoistedRoles.size) return null;
    return hoistedRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The role of the member used to set their color
   * @type {?Role}
   * @readonly
   */
  get color() {
    const coloredRoles = this._filtered.filter(role => role.color);
    if (!coloredRoles.size) return null;
    return coloredRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The role of the member with the highest position
   * @type {Role}
   * @readonly
   */
  get highest() {
    return this._filtered.reduce((prev, role) => role.comparePositionTo(prev) > 0 ? role : prev, this.first());
  }

  /**
   * Adds a role (or multiple roles) to the member.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to add
   * @param {string} [reason] Reason for adding the role(s)
   * @returns {Promise<GuildMember>}
   */
  async add(roleOrRoles, reason) {
    if (roleOrRoles instanceof Collection || roleOrRoles instanceof Array) {
      roleOrRoles = roleOrRoles.map(r => this.guild.roles.resolve(r));
      if (roleOrRoles.includes(null)) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      const newRoles = [...new Set(roleOrRoles.concat(...this.keys()))];
      return this.set(newRoles, reason);
    } else {
      if (this.guild.roles.resolve(roleOrRoles) === null) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      await this.client.api.guilds[this.guild.id].members[this.member.id].roles[roleOrRoles.id].put();
      return this.member;
    }
  }

  /**
   * Removes a role (or multiple roles) from the member.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to remove
   * @param {string} [reason] Reason for removing the role(s)
   * @returns {Promise<GuildMember>}
   */
  async remove(roleOrRoles, reason) {
    if (roleOrRoles instanceof Collection || roleOrRoles instanceof Array) {
      roleOrRoles = roleOrRoles.map(r => this.guild.roles.resolve(r));
      if (roleOrRoles.includes(null)) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      const newRoles = this.guild.roles.filter(role => !roleOrRoles.includes(role.id));
      return this.set(newRoles, reason);
    } else {
      if (this.guild.roles.resolve(roleOrRoles) === null) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      await this.client.api.guilds[this.guild.id].members[this.member.id].roles[roleOrRoles.id].remove();
      return this.member;
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

  _patch(roles) {
    this.member._roles = roles;
  }

  clone() {
    const clone = new this.constructor(this.member);
    clone._patch(this.filtered.keyArray());
    return clone;
  }

  *[Symbol.iterator]() {
    yield* this._filtered.entries();
  }

  valueOf() {
    return this._filtered;
  }
}

Util.mixin(GuildMemberRoleStore, ['set']);

module.exports = GuildMemberRoleStore;
