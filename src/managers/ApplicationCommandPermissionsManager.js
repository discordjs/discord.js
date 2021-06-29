'use strict';

const { Error, TypeError } = require('../errors');
const Collection = require('../util/Collection');
const { ApplicationCommandPermissionTypes, APIErrors } = require('../util/Constants');

/**
 * Manages API methods for permissions of Application Commands.
 */
class ApplicationCommandPermissionsManager {
  constructor(manager) {
    /**
     * The manager or command that this manager belongs to
     * @type {ApplicationCommandManager|ApplicationCommand}
     */
    this.manager = manager;

    /**
     * The guild that this manager acts on
     * @type {?Guild}
     */
    this.guild = manager.guild ?? null;

    /**
     * The id of the guild that this manager acts on
     * @type {?Snowflake}
     */
    this.guildID = manager.guildID ?? manager.guild?.id ?? null;

    /**
     * The id of the command this manager acts on
     * @type {?Snowflake}
     */
    this.commandID = manager.id ?? null;

    /**
     * The client that instantiated this Manager
     * @name ApplicationCommandPermissionsManager#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: manager.client });
  }

  /**
   * The APIRouter path to the commands
   * @param {Snowflake} guildID ID of the guild to use in the path,
   * @param {Snowflake} [commandID] ID of the application command
   * @returns {Object}
   * @private
   */
  permissionsPath(guildID, commandID) {
    return this.client.api.applications(this.client.application.id).guilds(guildID).commands(commandID).permissions;
  }

  /**
   * Data for setting the permissions of an application command.
   * @typedef {Object} ApplicationCommandPermissionData
   * @property {Snowflake} id The ID of the role or user
   * @property {ApplicationCommandPermissionType|number} type Whether this permission is for a role or a user
   * @property {boolean} permission Whether the role or user has the permission to use this command
   */

  /**
   * The object returned when fetching permissions for an application command.
   * @typedef {Object} ApplicationCommandPermissions
   * @property {Snowflake} id The ID of the role or user
   * @property {ApplicationCommandPermissionType} type Whether this permission is for a role or a user
   * @property {boolean} permission Whether the role or user has the permission to use this command
   */

  /**
   * Options for managing permissions for one or more Application Commands
   * <warn>When passing these options to a manager where `guildID` is `null`,
   * `guild` is a required parameter</warn>
   * @typedef {Object} BaseApplicationCommandPermissionsOptions
   * @param {GuildResolvable} [guild] The guild to modify / check permissions for
   * <warn>Ignored when the manager has a non-null `guildID` property</warn>
   * @param {ApplicationCommandResolvable} [command] The command to modify / check permissions for
   * <warn>Ignored when the manager has a non-null `commandID` property</warn>
   */

  /**
   * Fetches the permissions for one or multiple commands.
   * @param {BaseApplicationCommandPermissionsOptions} [options] Options used to fetch permissions
   * @returns {Promise<ApplicationCommandPermissions[]|Collection<Snowflake, ApplicationCommandPermissions[]>>}
   * @example
   * // Fetch permissions for one command
   * guild.commands.permissions.fetch({ command: '123456789012345678' })
   *   .then(perms => console.log(`Fetched permissions for ${perms.length} users`))
   *   .catch(console.error);
   * @example
   * // Fetch permissions for all commands in a guild
   * client.application.commands.permissions.fetch({ guild: '123456789012345678' })
   *   .then(perms => console.log(`Fetched permissions for ${perms.size} commands`))
   *   .catch(console.error);
   */
  async fetch({ guild, command } = {}) {
    const { guildID, commandID } = this._validateOptions(guild, command);
    if (commandID) {
      const data = await this.permissionsPath(guildID, commandID).get();
      return data.permissions.map(perm => this.constructor.transformPermissions(perm, true));
    }

    const data = await this.permissionsPath(guildID).get();
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
   * @typedef {Object} GuildApplicationCommandPermissionData
   * @property {Snowflake} id The ID of the command
   * @property {ApplicationCommandPermissionData[]} permissions The permissions for this command
   */

  /**
   * Options used to set permissions for one or more Application Commands in a guild
   * <warn>One of `command` AND `permissions`, OR `fullPermissions` is required.
   * `fullPermissions` is not a valid option when passing to a manager where `commandID` is non-null</warn>
   * @typedef {BaseApplicationCommandPermissionsOptions} SetApplicationCommandPermissionsOptions
   * @param {ApplicationCommandPermissionData[]} [permissions] The new permissions for the command
   * @param {GuildApplicationCommandPermissionData[]} [fullPermissions] The new permissions for all commands
   * in a guild <warn>When this parameter is set, permissions and command are ignored</warn>
   */

  /**
   * Sets the permissions for one or more commands.
   * @param {SetApplicationCommandPermissionsOptions} options Options used to set permissions
   * @returns {Promise<ApplicationCommandPermissions[]|Collection<Snowflake, ApplicationCommandPermissions[]>>}
   * @example
   * // Set the permissions for one command
   * client.application.commands.permissions.set({ command: '123456789012345678', permissions: [
   *   {
   *     id: '876543210987654321',
   *     type: 'USER',
   *     permission: false,
   *   },
   * ]})
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Set the permissions for all commands
   * guild.commands.permissions.set({ fullPermissions: [
   *   {
   *     id: '123456789012345678',
   *     permissions: [{
   *       id: '876543210987654321',
   *       type: 'USER',
   *       permission: false,
   *     }],
   *   },
   * ]})
   *   .then(console.log)
   *   .catch(console.error);
   */
  async set({ guild, command, permissions, fullPermissions } = {}) {
    const { guildID, commandID } = this._validateOptions(guild, command);

    if (commandID) {
      if (!Array.isArray(permissions)) {
        throw new TypeError('INVALID_TYPE', 'permissions', 'Array of ApplicationCommandPermissionData', true);
      }
      const data = await this.permissionsPath(guildID, commandID).put({
        data: { permissions: permissions.map(perm => this.constructor.transformPermissions(perm)) },
      });
      return data.permissions.map(perm => this.constructor.transformPermissions(perm, true));
    }

    if (!Array.isArray(fullPermissions)) {
      throw new TypeError('INVALID_TYPE', 'fullPermissions', 'Array of GuildApplicationCommandPermissionData', true);
    }

    const APIPermissions = [];
    for (const perm of fullPermissions) {
      if (!Array.isArray(perm.permissions)) throw new TypeError('INVALID_ELEMENT', 'Array', 'fullPermissions', perm);
      APIPermissions.push({
        id: perm.id,
        permissions: perm.permissions.map(p => this.constructor.transformPermissions(p)),
      });
    }
    const data = await this.permissionsPath(guildID).put({
      data: APIPermissions,
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
   * Options used to add permissions to a command
   * <warn>The `command` parameter is not optional when the managers `commandID` is `null`</warn>
   * @typedef {BaseApplicationCommandPermissionsOptions} AddApplicationCommandPermissionsOptions
   * @param {ApplicationCommandPermissionData[]} permissions The permissions to add to the command
   */

  /**
   * Add permissions to a command.
   * @param {AddApplicationCommandPermissionsOptions} options Options used to add permissions
   * @returns {Promise<ApplicationCommandPermissions[]>}
   * @example
   * // Block a role from the command permissions
   * guild.commands.permissions.add({ command: '123456789012345678', permissions: [
   *   {
   *     id: '876543211234567890',
   *     type: 'ROLE',
   *     permission: false
   *   },
   * ]})
   *   .then(console.log)
   *   .catch(console.error);
   */
  async add({ guild, command, permissions }) {
    const { guildID, commandID } = this._validateOptions(guild, command);
    if (!commandID) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');
    if (!Array.isArray(permissions)) {
      throw new TypeError('INVALID_TYPE', 'permissions', 'Array of ApplicationCommandPermissionData', true);
    }

    let existing = [];
    try {
      existing = await this.fetch({ guild: guildID, command: commandID });
    } catch (error) {
      if (error.code !== APIErrors.UNKNOWN_APPLICATION_COMMAND_PERMISSIONS) throw error;
    }

    const newPermissions = permissions.slice();
    for (const perm of existing) {
      if (!newPermissions.some(x => x.id === perm.id)) {
        newPermissions.push(perm);
      }
    }

    return this.set({ guild: guildID, command: commandID, permissions: newPermissions });
  }

  /**
   * Options used to remove permissions from a command
   * <warn>The `command` parameter is not optional when the managers `commandID` is `null`</warn>
   * @typedef {BaseApplicationCommandPermissionsOptions} RemoveApplicationCommandPermissionsOptions
   * @param {UserResolvable|UserResolvable[]} [users] The user(s) to remove from the command permissions
   * <warn>One of `users` or `roles` is required</warn>
   * @param {RoleResolvable|RoleResolvable[]} [roles] The role(s) to remove from the command permissions
   * <warn>One of `users` or `roles` is required</warn>
   */

  /**
   * Remove permissions from a command.
   * @param {RemoveApplicationCommandPermissionsOptions} options Options used to remove permissions
   * @returns {Promise<ApplicationCommandPermissions[]>}
   * @example
   * // Remove a user permission from this command
   * guild.commands.permissions.remove({ command: '123456789012345678', users: '876543210123456789' })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Remove multiple roles from this command
   * guild.commands.permissions.remove({
   *   command: '123456789012345678', roles: ['876543210123456789', '765432101234567890']
   * })
   *    .then(console.log)
   *    .catch(console.error);
   */
  async remove({ guild, command, users, roles }) {
    const { guildID, commandID } = this._validateOptions(guild, command);
    if (!commandID) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    if (!users && !roles) throw new TypeError('INVALID_TYPE', 'users OR roles', 'Array or Resolvable', true);

    let resolvedIDs = [];
    if (Array.isArray(users)) {
      users.forEach(user => {
        const userID = this.client.users.resolveID(user);
        if (!userID) throw new TypeError('INVALID_ELEMENT', 'Array', 'users', user);
        resolvedIDs.push(userID);
      });
    } else if (users) {
      const userID = this.client.users.resolveID(users);
      if (!userID) {
        throw new TypeError('INVALID_TYPE', 'users', 'Array or UserResolvable');
      }
      resolvedIDs.push(userID);
    }

    if (Array.isArray(roles)) {
      roles.forEach(role => {
        if (typeof role === 'string') {
          resolvedIDs.push(role);
          return;
        }
        if (!this.guild) throw new Error('GUILD_UNCACHED_ROLE_RESOLVE');
        const roleID = this.guild.roles.resolveID(role);
        if (!roleID) throw new TypeError('INVALID_ELEMENT', 'Array', 'users', role);
        resolvedIDs.push(roleID);
      });
    } else if (roles) {
      if (typeof roles === 'string') {
        resolvedIDs.push(roles);
      } else {
        if (!this.guild) throw new Error('GUILD_UNCACHED_ROLE_RESOLVE');
        const roleID = this.guild.roles.resolveID(roles);
        if (!roleID) {
          throw new TypeError('INVALID_TYPE', 'users', 'Array or RoleResolvable');
        }
        resolvedIDs.push(roleID);
      }
    }

    let existing = [];
    try {
      existing = await this.fetch({ guild: guildID, command: commandID });
    } catch (error) {
      if (error.code !== APIErrors.UNKNOWN_APPLICATION_COMMAND_PERMISSIONS) throw error;
    }

    const permissions = existing.filter(perm => !resolvedIDs.includes(perm.id));

    return this.set({ guild: guildID, command: commandID, permissions });
  }

  /**
   * Options used to check existance of permissions on a command
   * <warn>The `command` parameter is not optional when the managers `commandID` is `null`</warn>
   * @typedef {BaseApplicationCommandPermissionsOptions} HasApplicationCommandPermissionsOptions
   * @param {UserResolvable|RoleResolvable} permissionID The user or role to check if a permission exists for
   * on this command.
   */

  /**
   * Check whether a permission exists for a user or role
   * @param {AddApplicationCommandPermissionsOptions} options Options used to check permissions
   * @returns {Promise<boolean>}
   * @example
   * // Check whether a user has permission to use a command
   * guild.commands.permissions.has({ command: '123456789012345678', permissionID: '876543210123456789' })
   *  .then(console.log)
   *  .catch(console.error);
   */
  async has({ guild, command, permissionID }) {
    const { guildID, commandID } = this._validateOptions(guild, command);
    if (!commandID) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    if (!permissionID) throw new TypeError('INVALID_TYPE', 'permissionsID', 'UserResolvable or RoleResolvable');
    let resolvedID = permissionID;
    if (typeof permissionID !== 'string') {
      resolvedID = this.client.users.resolveID(permissionID);
      if (!resolvedID) {
        if (!this.guild) throw new Error('GUILD_UNCACHED_ROLE_RESOLVE');
        resolvedID = this.guild.roles.resolveID(permissionID);
      }
      if (!resolvedID) {
        throw new TypeError('INVALID_TYPE', 'permissionID', 'UserResolvable or RoleResolvable');
      }
    }

    let existing = [];
    try {
      existing = await this.fetch({ guild: guildID, command: commandID });
    } catch (error) {
      if (error.code !== APIErrors.UNKNOWN_APPLICATION_COMMAND_PERMISSIONS) throw error;
    }

    return existing.some(perm => perm.id === resolvedID);
  }

  _validateOptions(guild, command) {
    const guildID = this.guildID ?? this.client.guilds.resolveID(guild);
    if (!guildID) throw new Error('GLOBAL_COMMAND_PERMISSIONS');
    let commandID = this.commandID;
    if (command && !commandID) {
      commandID = this.manager.resolveID?.(command);
      if (!commandID && this.guild) {
        commandID = this.guild.commands.resolveID(command);
      }
      if (!commandID) {
        commandID = this.client.application?.commands.resolveID(command);
      }
      if (!commandID) {
        throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable', true);
      }
    }
    return { guildID, commandID };
  }

  /**
   * Transforms an {@link ApplicationCommandPermissionData} object into something that can be used with the API.
   * @param {ApplicationCommandPermissionData} permissions The permissions to transform
   * @param {boolean} [received] Whether these permissions have been received from Discord
   * @returns {APIApplicationCommandPermissions}
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

module.exports = ApplicationCommandPermissionsManager;

/**
 * @external APIApplicationCommandPermissions
 * @see {@link https://discord.com/developers/docs/interactions/slash-commands#applicationcommandpermissions}
 */
