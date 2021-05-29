'use strict';

const ApplicationCommandManager = require('./ApplicationCommandManager');
const { TypeError } = require('../errors');
const Collection = require('../util/Collection');
const { ApplicationCommandPermissionTypes } = require('../util/Constants');

/**
 * An extension for guild-specific application commands.
 * @extends {ApplicationCommandManager}
 */
class GuildApplicationCommandManager extends ApplicationCommandManager {
  constructor(guild, iterable) {
    super(guild.client, iterable);

    /**
     * The guild that this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * Fetches the permissions for one or multiple commands.
   * @param {ApplicationCommandResolvable} [command] The command to get the permissions from
   * @returns {Promise<ApplicationCommandPermissions[]|Collection<Snowflake, ApplicationCommandPermissions[]>>}
   * @example
   * // Fetch permissions for one command
   * guild.commands.fetchPermissions('123456789012345678')
   *   .then(perms => console.log(`Fetched permissions for ${perms.length} users`))
   *   .catch(console.error);
   * @example
   * // Fetch permissions for all commands
   * client.application.commands.fetchPermissions()
   *   .then(perms => console.log(`Fetched permissions for ${perms.size} commands`))
   *   .catch(console.error);
   */
  async fetchPermissions(command) {
    if (command) {
      const id = this.resolveID(command);
      if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

      const data = await this.commandPath(id).permissions.get();
      return data.permissions.map(perm => this.constructor.transformPermissions(perm, true));
    }

    const data = await this.commandPath.permissions.get();
    return data.reduce(
      (coll, perm) =>
        coll.set(
          perm.id,
          perm.permissions.map(p => this.constructor.transformPermissions(p, true)),
        ),
      new Collection(),
    );
  }

  /**
   * Data used for overwriting the permissions for all application commands in a guild.
   * @typedef {object} GuildApplicationCommandPermissionData
   * @prop {Snowflake} command The ID of the command
   * @prop {ApplicationCommandPermissionData[]} permissions The permissions for this command
   */

  /**
   * Sets the permissions for a command.
   * @param {ApplicationCommandResolvable|GuildApplicationCommandPermissionData[]} command The command to edit the
   * permissions for, or an array of guild application command permissions to set the permissions of all commands
   * @param {ApplicationCommandPermissionData[]} permissions The new permissions for the command
   * @returns {Promise<ApplicationCommandPermissions[]|Collection<Snowflake, ApplicationCommandPermissions[]>>}
   * @example
   * // Set the permissions for one command
   * client.application.commands.setPermissions('123456789012345678', [
   *   {
   *     id: '876543210987654321',
   *     type: 'USER',
   *     permission: false,
   *   },
   * ])
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Set the permissions for all commands
   * guild.commands.setPermissions([
   *   {
   *     id: '123456789012345678',
   *     permissions: [{
   *       id: '876543210987654321',
   *       type: 'USER',
   *       permission: false,
   *     }],
   *   },
   * ])
   *   .then(console.log)
   *   .catch(console.error);
   */
  async setPermissions(command, permissions) {
    const id = this.resolveID(command);

    if (id) {
      const data = await this.commandPath(id).permissions.put({
        data: { permissions: permissions.map(perm => this.constructor.transformPermissions(perm)) },
      });
      return data.permissions.map(perm => this.constructor.transformPermissions(perm, true));
    }

    const data = await this.commandPath.permissions.put({
      data: command.map(perm => ({
        id: perm.id,
        permissions: perm.permissions.map(p => this.constructor.transformPermissions(p)),
      })),
    });
    return data.reduce(
      (coll, perm) =>
        coll.set(
          perm.id,
          perm.permissions.map(p => this.constructor.transformPermissions(p, true)),
        ),
      new Collection(),
    );
  }

  /**
   * Add permissions to a command.
   * @param {ApplicationCommandResolvable} command The command to edit the permissions for
   * @param {ApplicationCommandPermissionData[]} permissions The permissions to add to this command
   * @returns {Promise<ApplicationCommandPermissions[]>}
   * @example
   * // Block a role from the command permissions
   * guild.commands.addPermissions('123456789012345678', [
   *   {
   *     id: '876543211234567890',
   *     type: 'ROLE',
   *     permission: false
   *   },
   * ])
   *   .then(console.log)
   *   .catch(console.error);
   */
  async addPermissions(command, permissions) {
    const id = this.resolveID(command);
    if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    const perms = await this.fetchPermissions(id).catch(err => {
      if (err.httpStatus !== 404) throw err;
      return [];
    });

    const newPermissions = [...permissions];
    for (const perm of perms) {
      if (!newPermissions.find(x => x.id === perm.id)) {
        newPermissions.push(perm);
      }
    }

    return this.setPermissions(id, newPermissions);
  }

  /**
   * Remove permissions from a command.
   * @param {ApplicationCommandResolvable} command The command to edit the permissions for
   * @param {UserResolvable | RoleResolvable | UserResolvable[] | RoleResolvable[]} userOrRole The user(s) and role(s)
   * to remove from the command permissions
   * @returns {Promise<ApplicationCommandPermissions[]>}
   * @example
   * // Remove a user permission from this command
   * guild.commands.addPermissions('123456789012345678', '876543210123456789')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Remove multiple roles from this command
   * guild.commands.removePermissions('123456789012345678', [ '876543210123456789', '765432101234567890' ])
   *    .then(console.log)
   *    .catch(console.error);
   */
  async removePermissions(command, userOrRole) {
    const id = this.resolveID(command);
    if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    let permissions = await this.fetchPermissions(id).catch(err => {
      if (err.httpStatus !== 404) throw err;
      return [];
    });

    if (Array.isArray(userOrRole)) {
      userOrRole = userOrRole.map(x => {
        if (!this.client.users.resolveID(x) && !this.guild.roles.resolveID(x)) {
          throw new TypeError('INVALID_ELEMENT', 'Array', 'userOrRole', x);
        }
        return this.client.users.resolveID(x) ?? this.guild.roles.resolveID(x);
      });

      permissions = permissions.filter(perm => !userOrRole.includes(perm.id));
    } else {
      if (typeof userOrRole !== 'string') {
        userOrRole = this.client.users.resolveID(userOrRole) && !this.guild.roles.resolveID(userOrRole);
        if (!userOrRole) {
          throw new TypeError('INVALID_TYPE', 'userOrRole', 'UserResolvable or RoleResolvable');
        }
      }
      permissions = permissions.filter(perm => perm.id !== userOrRole);
    }

    return this.setPermissions(id, permissions);
  }

  /**
   * Transforms an {@link ApplicationCommandPermissionData} object into something that can be used with the API.
   * @param {ApplicationCommandPermissionData} permissions The permissions to transform
   * @param {boolean} [received] Whether these permissions have been received from Discord
   * @returns {Object}
   * @private
   */
  static transformPermissions(permissions, received) {
    return {
      id: permissions.id,
      permission: permissions.permission,
      type:
        typeof permissions.type === 'number' && !received
          ? permissions.type
          : ApplicationCommandPermissionTypes[permissions.type],
    };
  }
}

module.exports = GuildApplicationCommandManager;
