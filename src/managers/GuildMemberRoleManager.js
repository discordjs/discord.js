'use strict';

const { TypeError } = require('../errors');
const Collection = require('../util/Collection');

/**
 * Manages API methods for roles of a GuildMember and stores their cache.
 */
class GuildMemberRoleManager {
  constructor(member) {
    /**
     * The GuildMember this manager belongs to
     * @type {GuildMember}
     */
    this.member = member;
    /**
     * The Guild this manager belongs to
     * @type {Guild}
     */
    this.guild = member.guild;
    Object.defineProperty(this, 'client', { value: member.client });
  }

  /**
   * The filtered collection of roles of the member
   * @type {Collection<Snowflake, Role>}
   * @private
   * @readonly
   */
  get _roles() {
    const everyone = this.guild.roles.everyone;
    return this.guild.roles.cache.filter(role => this.member._roles.includes(role.id)).set(everyone.id, everyone);
  }

  /**
   * The roles of this member
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get cache() {
    return this._roles;
  }

  /**
   * The role of the member used to hoist them in a separate category in the users list
   * @type {?Role}
   * @readonly
   */
  get hoist() {
    const hoistedRoles = this._roles.filter(role => role.hoist);
    if (!hoistedRoles.size) return null;
    return hoistedRoles.reduce((prev, role) => (!prev || role.comparePositionTo(prev) > 0 ? role : prev));
  }

  /**
   * The role of the member used to set their color
   * @type {?Role}
   * @readonly
   */
  get color() {
    const coloredRoles = this._roles.filter(role => role.color);
    if (!coloredRoles.size) return null;
    return coloredRoles.reduce((prev, role) => (!prev || role.comparePositionTo(prev) > 0 ? role : prev));
  }

  /**
   * The role of the member with the highest position
   * @type {Role}
   * @readonly
   */
  get highest() {
    return this._roles.reduce((prev, role) => (role.comparePositionTo(prev) > 0 ? role : prev), this._roles.first());
  }

  /**
   * The premium subscriber role of the guild, if present on the member
   * @type {?Role}
   * @readonly
   */
  get premiumSubscriberRole() {
    return this.cache.find(role => role.tags && role.tags.premiumSubscriberRole) || null;
  }

  /**
   * The managed role this member created when joining the guild, if any
   * <info>Only ever available on bots</info>
   * @type {?Role}
   * @readonly
   */
  get botRole() {
    if (!this.member.user.bot) return null;
    return this.cache.find(role => role.tags && role.tags.botID === this.member.user.id) || null;
  }

  /**
   * Adds a role (or multiple roles) to the member.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to add
   * @param {string} [reason] Reason for adding the role(s)
   * @returns {Promise<GuildMember>}
   */
  async add(roleOrRoles, reason) {
    if (roleOrRoles instanceof Collection || Array.isArray(roleOrRoles)) {
      const resolvedRoles = [];
      for (const role of roleOrRoles.values()) {
        const resolvedRole = this.guild.roles.resolveID(role);
        if (!resolvedRole) throw new TypeError('INVALID_ELEMENT', 'Array or Collection', 'roles', role);
        resolvedRoles.push(resolvedRole);
      }

      const newRoles = [...new Set(resolvedRoles.concat(...this._roles.values()))];
      return this.set(newRoles, reason);
    } else {
      roleOrRoles = this.guild.roles.resolveID(roleOrRoles);
      if (roleOrRoles === null) {
        throw new TypeError('INVALID_TYPE', 'roles', 'Role, Snowflake or Array or Collection of Roles or Snowflakes');
      }

      await this.client.api.guilds[this.guild.id].members[this.member.id].roles[roleOrRoles].put({ reason });

      const clone = this.member._clone();
      clone._roles = [...this._roles.keys(), roleOrRoles];
      return clone;
    }
  }

  /**
   * Removes a role (or multiple roles) from the member.
   * @param {RoleResolvable|RoleResolvable[]|Collection<Snowflake, Role>} roleOrRoles The role or roles to remove
   * @param {string} [reason] Reason for removing the role(s)
   * @returns {Promise<GuildMember>}
   */
  async remove(roleOrRoles, reason) {
    if (roleOrRoles instanceof Collection || Array.isArray(roleOrRoles)) {
      const resolvedRoles = [];
      for (const role of roleOrRoles.values()) {
        const resolvedRole = this.guild.roles.resolveID(role);
        if (!resolvedRole) throw new TypeError('INVALID_ELEMENT', 'Array or Collection', 'roles', role);
        resolvedRoles.push(resolvedRole);
      }

      const newRoles = this._roles.filter(role => !resolvedRoles.includes(role.id));
      return this.set(newRoles, reason);
    } else {
      roleOrRoles = this.guild.roles.resolveID(roleOrRoles);
      if (roleOrRoles === null) {
        throw new TypeError('INVALID_TYPE', 'roles', 'Role, Snwoflake or Array or Collection of Roles or Snowflakes');
      }

      await this.client.api.guilds[this.guild.id].members[this.member.id].roles[roleOrRoles].delete({ reason });

      const clone = this.member._clone();
      const newRoles = this._roles.filter(role => role.id !== roleOrRoles);
      clone._roles = [...newRoles.keys()];
      return clone;
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
   *   .then(member => console.log(`Member roles is now of ${member.roles.cache.size} size`))
   *   .catch(console.error);
   */
  set(roles, reason) {
    return this.member.edit({ roles }, reason);
  }

  clone() {
    const clone = new this.constructor(this.member);
    clone.member._roles = [...this._roles.keyArray()];
    return clone;
  }

  valueOf() {
    return this.cache;
  }
}

module.exports = GuildMemberRoleManager;
