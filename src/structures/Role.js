'use strict';

const Snowflake = require('../util/Snowflake');
const Permissions = require('../util/Permissions');
const Util = require('../util/Util');
const Base = require('./Base');
const { Error, TypeError } = require('../errors');

/**
 * Represents a role on Discord.
 * @extends {Base}
 */
class Role extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild that the role belongs to
     * @type {Guild}
     */
    this.guild = guild;

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of the role (unique to the guild it is part of)
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the role
     * @type {string}
     */
    this.name = data.name;

    /**
     * The base 10 color of the role
     * @type {number}
     */
    this.color = data.color;

    /**
     * If true, users that are part of this role will appear in a separate category in the users list
     * @type {boolean}
     */
    this.hoist = data.hoist;

    /**
     * The raw position of the role from the API
     * @type {number}
     */
    this.rawPosition = data.position;

    /**
     * The permissions of the role
     * @type {Readonly<Permissions>}
     */
    this.permissions = new Permissions(data.permissions).freeze();

    /**
     * Whether or not the role is managed by an external service
     * @type {boolean}
     */
    this.managed = data.managed;

    /**
     * Whether or not the role can be mentioned by anyone
     * @type {boolean}
     */
    this.mentionable = data.mentionable;

    /**
     * Whether the role has been deleted
     * @type {boolean}
     */
    this.deleted = false;
  }

  /**
   * The timestamp the role was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the role was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The hexadecimal version of the role color, with a leading hashtag
   * @type {string}
   * @readonly
   */
  get hexColor() {
    return `#${this.color.toString(16).padStart(6, '0')}`;
  }

  /**
   * The cached guild members that have this role
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    return this.guild.members.filter(m => m.roles.has(this.id));
  }

  /**
   * Whether the role is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    if (this.managed) return false;
    const clientMember = this.guild.member(this.client.user);
    if (!clientMember.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return false;
    return clientMember.roles.highest.comparePositionTo(this) > 0;
  }

  /**
   * The position of the role in the role manager
   * @type {number}
   * @readonly
   */
  get position() {
    const sorted = this.guild._sortedRoles();
    return sorted.array().indexOf(sorted.get(this.id));
  }

  /**
   * Compares this role's position to another role's.
   * @param {RoleResolvable} role Role to compare to this one
   * @returns {number} Negative number if this role's position is lower (other role's is higher),
   * positive number if this one is higher (other's is lower), 0 if equal
   */
  comparePositionTo(role) {
    role = this.guild.roles.resolve(role);
    if (!role) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
    return this.constructor.comparePositions(this, role);
  }

  /**
   * The data for a role.
   * @typedef {Object} RoleData
   * @property {string} [name] The name of the role
   * @property {ColorResolvable} [color] The color of the role, either a hex string or a base 10 number
   * @property {boolean} [hoist] Whether or not the role should be hoisted
   * @property {number} [position] The position of the role
   * @property {PermissionResolvable} [permissions] The permissions of the role
   * @property {boolean} [mentionable] Whether or not the role should be mentionable
   */

  /**
   * Edits the role.
   * @param {RoleData} data The new data for the role
   * @param {string} [reason] Reason for editing this role
   * @returns {Promise<Role>}
   * @example
   * // Edit a role
   * role.edit({ name: 'new role' })
   *   .then(updated => console.log(`Edited role ${updated.name} name to ${updated.name}`))
   *   .catch(console.error);
   */
  async edit(data, reason) {
    if (data.permissions) data.permissions = Permissions.resolve(data.permissions);
    else data.permissions = this.permissions.bitfield;
    if (typeof data.position !== 'undefined') {
      await Util.setPosition(this, data.position, false, this.guild._sortedRoles(),
        this.client.api.guilds(this.guild.id).roles, reason)
        .then(updatedRoles => {
          this.client.actions.GuildRolesPositionUpdate.handle({
            guild_id: this.guild.id,
            roles: updatedRoles,
          });
        });
    }
    return this.client.api.guilds[this.guild.id].roles[this.id].patch({
      data: {
        name: data.name || this.name,
        color: data.color !== null ? Util.resolveColor(data.color || this.color) : null,
        hoist: typeof data.hoist !== 'undefined' ? data.hoist : this.hoist,
        permissions: data.permissions,
        mentionable: typeof data.mentionable !== 'undefined' ? data.mentionable : this.mentionable,
      },
      reason,
    })
      .then(role => {
        const clone = this._clone();
        clone._patch(role);
        return clone;
      });
  }

  /**
   * Returns `channel.permissionsFor(role)`. Returns permissions for a role in a guild channel,
   * taking into account permission overwrites.
   * @param {ChannelResolvable} channel The guild channel to use as context
   * @returns {Readonly<Permissions>}
   */
  permissionsIn(channel) {
    channel = this.guild.channels.resolve(channel);
    if (!channel) throw new Error('GUILD_CHANNEL_RESOLVE');
    return channel.rolePermissions(this);
  }

  /**
   * Sets a new name for the role.
   * @param {string} name The new name of the role
   * @param {string} [reason] Reason for changing the role's name
   * @returns {Promise<Role>}
   * @example
   * // Set the name of the role
   * role.setName('new role')
   *   .then(updated => console.log(`Edited name of role ${role.name} to ${updated.name}`))
   *   .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Sets a new color for the role.
   * @param {ColorResolvable} color The color of the role
   * @param {string} [reason] Reason for changing the role's color
   * @returns {Promise<Role>}
   * @example
   * // Set the color of a role
   * role.setColor('#FF0000')
   *   .then(updated => console.log(`Set color of role to ${updated.color}`))
   *   .catch(console.error);
   */
  setColor(color, reason) {
    return this.edit({ color }, reason);
  }

  /**
   * Sets whether or not the role should be hoisted.
   * @param {boolean} hoist Whether or not to hoist the role
   * @param {string} [reason] Reason for setting whether or not the role should be hoisted
   * @returns {Promise<Role>}
   * @example
   * // Set the hoist of the role
   * role.setHoist(true)
   *   .then(r => console.log(`Role hoisted: ${r.hoist}`))
   *   .catch(console.error);
   */
  setHoist(hoist, reason) {
    return this.edit({ hoist }, reason);
  }

  /**
   * Sets the permissions of the role.
   * @param {PermissionResolvable} permissions The permissions of the role
   * @param {string} [reason] Reason for changing the role's permissions
   * @returns {Promise<Role>}
   * @example
   * // Set the permissions of the role
   * role.setPermissions(['KICK_MEMBERS', 'BAN_MEMBERS'])
   *   .then(updated => console.log(`Updated permissions to ${updated.permissions.bitfield}`))
   *   .catch(console.error);
   * @example
   * // Remove all permissions from a role
   * role.setPermissions(0)
   *   .then(updated => console.log(`Updated permissions to ${updated.permissions.bitfield}`))
   *   .catch(console.error);
   */
  setPermissions(permissions, reason) {
    return this.edit({ permissions }, reason);
  }

  /**
   * Sets whether this role is mentionable.
   * @param {boolean} mentionable Whether this role should be mentionable
   * @param {string} [reason] Reason for setting whether or not this role should be mentionable
   * @returns {Promise<Role>}
   * @example
   * // Make the role mentionable
   * role.setMentionable(true)
   *   .then(updated => console.log(`Role updated ${updated.name}`))
   *   .catch(console.error);
   */
  setMentionable(mentionable, reason) {
    return this.edit({ mentionable }, reason);
  }

  /**
   * Sets the position of the role.
   * @param {number} position The position of the role
   * @param {Object} [options] Options for setting position
   * @param {boolean} [options.relative=false] Change the position relative to its current value
   * @param {boolean} [options.reason] Reason for changing the position
   * @returns {Promise<Role>}
   * @example
   * // Set the position of the role
   * role.setPosition(1)
   *   .then(updated => console.log(`Role position: ${updated.position}`))
   *   .catch(console.error);
   */
  setPosition(position, { relative, reason } = {}) {
    return Util.setPosition(this, position, relative,
      this.guild._sortedRoles(), this.client.api.guilds(this.guild.id).roles, reason)
      .then(updatedRoles => {
        this.client.actions.GuildRolesPositionUpdate.handle({
          guild_id: this.guild.id,
          roles: updatedRoles,
        });
        return this;
      });
  }

  /**
   * Deletes the role.
   * @param {string} [reason] Reason for deleting this role
   * @returns {Promise<Role>}
   * @example
   * // Delete a role
   * role.delete('The role needed to go')
   *   .then(deleted => console.log(`Deleted role ${deleted.name}`))
   *   .catch(console.error);
   */
  delete(reason) {
    return this.client.api.guilds[this.guild.id].roles[this.id].delete({ reason })
      .then(() => {
        this.client.actions.GuildRoleDelete.handle({ guild_id: this.guild.id, role_id: this.id });
        return this;
      });
  }

  /**
   * Whether this role equals another role. It compares all properties, so for most operations
   * it is advisable to just compare `role.id === role2.id` as it is much faster and is often
   * what most users need.
   * @param {Role} role Role to compare with
   * @returns {boolean}
   */
  equals(role) {
    return role &&
      this.id === role.id &&
      this.name === role.name &&
      this.color === role.color &&
      this.hoist === role.hoist &&
      this.position === role.position &&
      this.permissions.bitfield === role.permissions.bitfield &&
      this.managed === role.managed;
  }

  /**
   * When concatenated with a string, this automatically returns the role's mention instead of the Role object.
   * @returns {string}
   * @example
   * // Logs: Role: <@&123456789012345678>
   * console.log(`Role: ${role}`);
   */
  toString() {
    if (this.id === this.guild.id) return '@everyone';
    return `<@&${this.id}>`;
  }

  toJSON() {
    return super.toJSON({ createdTimestamp: true });
  }

  /**
   * Compares the positions of two roles.
   * @param {Role} role1 First role to compare
   * @param {Role} role2 Second role to compare
   * @returns {number} Negative number if the first role's position is lower (second role's is higher),
   * positive number if the first's is higher (second's is lower), 0 if equal
   */
  static comparePositions(role1, role2) {
    if (role1.position === role2.position) return role2.id - role1.id;
    return role1.position - role2.position;
  }
}

module.exports = Role;
