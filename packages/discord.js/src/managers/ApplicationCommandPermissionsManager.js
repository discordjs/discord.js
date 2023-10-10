'use strict';

const { Collection } = require('@discordjs/collection');
const { ApplicationCommandPermissionType, RESTJSONErrorCodes, Routes } = require('discord-api-types/v10');
const BaseManager = require('./BaseManager');
const { DiscordjsError, DiscordjsTypeError, ErrorCodes } = require('../errors');

/**
 * Manages API methods for permissions of Application Commands.
 * @extends {BaseManager}
 */
class ApplicationCommandPermissionsManager extends BaseManager {
  constructor(manager) {
    super(manager.client);

    /**
     * The manager or command that this manager belongs to
     * @type {ApplicationCommandManager|ApplicationCommand}
     * @private
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
    this.guildId = manager.guildId ?? manager.guild?.id ?? null;

    /**
     * The id of the command this manager acts on
     * @type {?Snowflake}
     */
    this.commandId = manager.id ?? null;
  }

  /**
   * The APIRouter path to the commands
   * @param {Snowflake} guildId The guild's id to use in the path,
   * @param {Snowflake} [commandId] The application command's id
   * @returns {string}
   * @private
   */
  permissionsPath(guildId, commandId) {
    if (commandId) {
      return Routes.applicationCommandPermissions(this.client.application.id, guildId, commandId);
    }

    return Routes.guildApplicationCommandsPermissions(this.client.application.id, guildId);
  }

  /* eslint-disable max-len */
  /**
   * The object returned when fetching permissions for an application command.
   * @typedef {Object} ApplicationCommandPermissions
   * @property {Snowflake} id The role, user, or channel's id. Can also be a
   * {@link https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-constants permission constant}.
   * @property {ApplicationCommandPermissionType} type Whether this permission is for a role or a user
   * @property {boolean} permission Whether the role or user has the permission to use this command
   */
  /* eslint-enable max-len */

  /**
   * Options for managing permissions for one or more Application Commands
   * <warn>When passing these options to a manager where `guildId` is `null`,
   * `guild` is a required parameter</warn>
   * @typedef {Object} BaseApplicationCommandPermissionsOptions
   * @property {GuildResolvable} [guild] The guild to modify / check permissions for
   * <warn>Ignored when the manager has a non-null `guildId` property</warn>
   * @property {ApplicationCommandResolvable} [command] The command to modify / check permissions for
   * <warn>Ignored when the manager has a non-null `commandId` property</warn>
   */

  /**
   * Fetches the permissions for one or multiple commands. Providing the client's id as the "command id" will fetch
   * *only* the guild level permissions
   * @param {BaseApplicationCommandPermissionsOptions} [options] Options used to fetch permissions
   * @returns {Promise<ApplicationCommandPermissions[]|Collection<Snowflake, ApplicationCommandPermissions[]>>}
   * @example
   * // Fetch permissions for one command
   * guild.commands.permissions.fetch({ command: '123456789012345678' })
   *   .then(perms => console.log(`Fetched ${perms.length} overwrites`))
   *   .catch(console.error);
   * @example
   * // Fetch permissions for all commands in a guild
   * client.application.commands.permissions.fetch({ guild: '123456789012345678' })
   *   .then(perms => console.log(`Fetched permissions for ${perms.size} commands`))
   *   .catch(console.error);
   * @example
   * // Fetch guild level permissions
   * guild.commands.permissions.fetch({ command: client.user.id })
   *   .then(perms => console.log(`Fetched ${perms.length} guild level permissions`))
   *   .catch(console.error);
   */
  async fetch({ guild, command } = {}) {
    const { guildId, commandId } = this._validateOptions(guild, command);
    if (commandId) {
      const data = await this.client.rest.get(this.permissionsPath(guildId, commandId));
      return data.permissions;
    }

    const data = await this.client.rest.get(this.permissionsPath(guildId));
    return data.reduce((coll, perm) => coll.set(perm.id, perm.permissions), new Collection());
  }

  /**
   * Options used to set permissions for one or more Application Commands in a guild
   * <warn>Omitting the `command` parameter edits the guild wide permissions
   * when the manager's `commandId` is `null`</warn>
   * @typedef {BaseApplicationCommandPermissionsOptions} ApplicationCommandPermissionsEditOptions
   * @property {ApplicationCommandPermissions[]} permissions The new permissions for the guild or overwrite
   * @property {string} token The bearer token to use that authorizes the permission edit
   */

  /**
   * Sets the permissions for the guild or a command overwrite.
   * @param {ApplicationCommandPermissionsEditOptions} options Options used to set permissions
   * @returns {Promise<ApplicationCommandPermissions[]|Collection<Snowflake, ApplicationCommandPermissions[]>>}
   * @example
   * // Set a permission overwrite for a command
   * client.application.commands.permissions.set({
   *  guild: '892455839386304532',
   *  command: '123456789012345678',
   *  token: 'TotallyRealToken',
   *  permissions: [
   *    {
   *      id: '876543210987654321',
   *      type: ApplicationCommandPermissionType.User,
   *      permission: false,
   *    },
   * ]})
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Set the permissions used for the guild (commands without overwrites)
   * guild.commands.permissions.set({ token: 'TotallyRealToken', permissions: [
   *   {
   *     id: '123456789012345678',
   *     permissions: [{
   *       id: '876543210987654321',
   *       type: ApplicationCommandPermissionType.User,
   *       permission: false,
   *     }],
   *   },
   * ]})
   *   .then(console.log)
   *   .catch(console.error);
   */
  async set({ guild, command, permissions, token } = {}) {
    if (!token) {
      throw new DiscordjsError(ErrorCodes.ApplicationCommandPermissionsTokenMissing);
    }
    let { guildId, commandId } = this._validateOptions(guild, command);

    if (!Array.isArray(permissions)) {
      throw new DiscordjsTypeError(
        ErrorCodes.InvalidType,
        'permissions',
        'Array of ApplicationCommandPermissions',
        true,
      );
    }

    if (!commandId) {
      commandId = this.client.user.id;
    }
    const data = await this.client.rest.put(this.permissionsPath(guildId, commandId), {
      body: { permissions },
      auth: false,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.permissions;
  }

  /**
   * Add permissions to a command.
   * @param {ApplicationCommandPermissionsEditOptions} options Options used to add permissions
   * @returns {Promise<ApplicationCommandPermissions[]>}
   * @example
   * // Add a rule to block a role from using a command
   * guild.commands.permissions.add({ command: '123456789012345678', token: 'TotallyRealToken', permissions: [
   *   {
   *     id: '876543211234567890',
   *     type: ApplicationCommandPermissionType.Role,
   *     permission: false
   *   },
   * ]})
   *   .then(console.log)
   *   .catch(console.error);
   */
  async add({ guild, command, permissions, token } = {}) {
    if (!token) {
      throw new DiscordjsError(ErrorCodes.ApplicationCommandPermissionsTokenMissing);
    }
    let { guildId, commandId } = this._validateOptions(guild, command);
    if (!commandId) {
      commandId = this.client.user.id;
    }
    if (!Array.isArray(permissions)) {
      throw new DiscordjsTypeError(
        ErrorCodes.InvalidType,
        'permissions',
        'Array of ApplicationCommandPermissions',
        true,
      );
    }

    let existingPermissions = [];
    try {
      existingPermissions = await this.fetch({ guild: guildId, command: commandId });
    } catch (error) {
      if (error.code !== RESTJSONErrorCodes.UnknownApplicationCommandPermissions) throw error;
    }

    const newPermissions = permissions.slice();
    for (const existingPermission of existingPermissions) {
      if (!newPermissions.some(newPermission => newPermission.id === existingPermission.id)) {
        newPermissions.push(existingPermission);
      }
    }

    return this.set({ guild: guildId, command: commandId, permissions: newPermissions, token });
  }

  /**
   * A static snowflake that identifies the everyone role for application command permissions.
   * It is the same as the guild id
   * @typedef {Snowflake} RolePermissionConstant
   */

  /**
   * A static snowflake that identifies the "all channels" entity for application command permissions.
   * It will be the result of the calculation `guildId - 1`
   * @typedef {Snowflake} ChannelPermissionConstant
   */

  /**
   * Options used to remove permissions from a command
   * <warn>Omitting the `command` parameter removes from the guild wide permissions
   * when the managers `commandId` is `null`</warn>
   * <warn>At least one of `users`, `roles`, and `channels` is required</warn>
   * @typedef {BaseApplicationCommandPermissionsOptions} RemoveApplicationCommandPermissionsOptions
   * @property {string} token The bearer token to use that authorizes the permission removal
   * @property {UserResolvable[]} [users] The user(s) to remove
   * @property {Array<RoleResolvable|RolePermissionConstant>} [roles] The role(s) to remove
   * @property {Array<GuildChannelResolvable|ChannelPermissionConstant>} [channels] The channel(s) to remove
   */

  /**
   * Remove permissions from a command.
   * @param {RemoveApplicationCommandPermissionsOptions} options Options used to remove permissions
   * @returns {Promise<ApplicationCommandPermissions[]>}
   * @example
   * // Remove a user permission from this command
   * guild.commands.permissions.remove({
   *  command: '123456789012345678', users: '876543210123456789', token: 'TotallyRealToken',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Remove multiple roles from this command
   * guild.commands.permissions.remove({
   *   command: '123456789012345678', roles: ['876543210123456789', '765432101234567890'], token: 'TotallyRealToken',
   * })
   *    .then(console.log)
   *    .catch(console.error);
   */
  async remove({ guild, command, users, roles, channels, token } = {}) {
    if (!token) {
      throw new DiscordjsError(ErrorCodes.ApplicationCommandPermissionsTokenMissing);
    }
    let { guildId, commandId } = this._validateOptions(guild, command);
    if (!commandId) {
      commandId = this.client.user.id;
    }

    if (!users && !roles && !channels) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'users OR roles OR channels', 'Array or Resolvable', true);
    }

    let resolvedUserIds = [];
    if (Array.isArray(users)) {
      for (const user of users) {
        const userId = this.client.users.resolveId(user);
        if (!userId) throw new DiscordjsTypeError(ErrorCodes.InvalidElement, 'Array', 'users', user);
        resolvedUserIds.push(userId);
      }
    }

    let resolvedRoleIds = [];
    if (Array.isArray(roles)) {
      for (const role of roles) {
        if (typeof role === 'string') {
          resolvedRoleIds.push(role);
          continue;
        }
        if (!this.guild) throw new DiscordjsError(ErrorCodes.GuildUncachedEntityResolve, 'roles');
        const roleId = this.guild.roles.resolveId(role);
        if (!roleId) throw new DiscordjsTypeError(ErrorCodes.InvalidElement, 'Array', 'users', role);
        resolvedRoleIds.push(roleId);
      }
    }

    let resolvedChannelIds = [];
    if (Array.isArray(channels)) {
      for (const channel of channels) {
        if (typeof channel === 'string') {
          resolvedChannelIds.push(channel);
          continue;
        }
        if (!this.guild) throw new DiscordjsError(ErrorCodes.GuildUncachedEntityResolve, 'channels');
        const channelId = this.guild.channels.resolveId(channel);
        if (!channelId) throw new DiscordjsTypeError(ErrorCodes.InvalidElement, 'Array', 'channels', channel);
        resolvedChannelIds.push(channelId);
      }
    }

    let existing = [];
    try {
      existing = await this.fetch({ guild: guildId, command: commandId });
    } catch (error) {
      if (error.code !== RESTJSONErrorCodes.UnknownApplicationCommandPermissions) throw error;
    }

    const permissions = existing.filter(perm => {
      switch (perm.type) {
        case ApplicationCommandPermissionType.Role:
          return !resolvedRoleIds.includes(perm.id);
        case ApplicationCommandPermissionType.User:
          return !resolvedUserIds.includes(perm.id);
        case ApplicationCommandPermissionType.Channel:
          return !resolvedChannelIds.includes(perm.id);
      }
      return true;
    });

    return this.set({ guild: guildId, command: commandId, permissions, token });
  }

  /**
   * Options used to check the existence of permissions on a command
   * <warn>The `command` parameter is not optional when the managers `commandId` is `null`</warn>
   * @typedef {BaseApplicationCommandPermissionsOptions} HasApplicationCommandPermissionsOptions
   * @property {ApplicationCommandPermissionIdResolvable} permissionId The entity to check if a permission exists for
   * on this command.
   * @property {ApplicationCommandPermissionType} [permissionType] Check for a specific type of permission
   */

  /**
   * Check whether a permission exists for a user, role, or channel
   * @param {HasApplicationCommandPermissionsOptions} options Options used to check permissions
   * @returns {Promise<boolean>}
   * @example
   * // Check whether a user has permission to use a command
   * guild.commands.permissions.has({ command: '123456789012345678', permissionId: '876543210123456789' })
   *  .then(console.log)
   *  .catch(console.error);
   */
  async has({ guild, command, permissionId, permissionType }) {
    const { guildId, commandId } = this._validateOptions(guild, command);
    if (!commandId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'command', 'ApplicationCommandResolvable');

    if (!permissionId) {
      throw new DiscordjsTypeError(
        ErrorCodes.InvalidType,
        'permissionId',
        'UserResolvable, RoleResolvable, ChannelResolvable, or Permission Constant',
      );
    }
    let resolvedId = permissionId;
    if (typeof permissionId !== 'string') {
      resolvedId = this.client.users.resolveId(permissionId);
      if (!resolvedId) {
        if (!this.guild) throw new DiscordjsError(ErrorCodes.GuildUncachedEntityResolve, 'roles');
        resolvedId = this.guild.roles.resolveId(permissionId);
      }
      if (!resolvedId) {
        resolvedId = this.guild.channels.resolveId(permissionId);
      }
      if (!resolvedId) {
        throw new DiscordjsTypeError(
          ErrorCodes.InvalidType,
          'permissionId',
          'UserResolvable, RoleResolvable, ChannelResolvable, or Permission Constant',
        );
      }
    }

    let existing = [];
    try {
      existing = await this.fetch({ guild: guildId, command: commandId });
    } catch (error) {
      if (error.code !== RESTJSONErrorCodes.UnknownApplicationCommandPermissions) throw error;
    }

    // Check permission type if provided for the single edge case where a channel id is the same as the everyone role id
    return existing.some(perm => perm.id === resolvedId && (permissionType ?? perm.type) === perm.type);
  }

  _validateOptions(guild, command) {
    const guildId = this.guildId ?? this.client.guilds.resolveId(guild);
    if (!guildId) throw new DiscordjsError(ErrorCodes.GlobalCommandPermissions);
    let commandId = this.commandId;
    if (command && !commandId) {
      commandId = this.manager.resolveId?.(command);
      if (!commandId && this.guild) {
        commandId = this.guild.commands.resolveId(command);
      }
      commandId ??= this.client.application?.commands.resolveId(command);
      if (!commandId) {
        throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'command', 'ApplicationCommandResolvable', true);
      }
    }
    return { guildId, commandId };
  }
}

module.exports = ApplicationCommandPermissionsManager;

/* eslint-disable max-len */
/**
 * Data that resolves to an id used for an application command permission
 * @typedef {UserResolvable|RoleResolvable|GuildChannelResolvable|RolePermissionConstant|ChannelPermissionConstant} ApplicationCommandPermissionIdResolvable
 */
