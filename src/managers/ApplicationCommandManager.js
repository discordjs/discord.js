'use strict';

const BaseManager = require('./BaseManager');
const { Error, TypeError } = require('../errors');
const ApplicationCommand = require('../structures/ApplicationCommand');
const Collection = require('../util/Collection');
const { ApplicationCommandPermissionTypes } = require('../util/Constants');

/**
 * Manages API methods for application commands and stores their cache.
 * @extends {BaseManager}
 */
class ApplicationCommandManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, ApplicationCommand);
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, ApplicationCommand>}
   * @name ApplicationCommandManager#cache
   */

  add(data, cache) {
    return super.add(data, cache, { extras: [this.guild] });
  }

  /**
   * The APIRouter path to the commands
   * @param {Snowflake} [options.id] ID of the application command
   * @param {Snowflake} [options.guildID] ID of the guild to use in the path,
   * ignored when using a {@link GuildApplicationCommandManager}
   * @returns {Object}
   * @private
   */
  commandPath({ id, guildID } = {}) {
    let path = this.client.api.applications(this.client.application.id);
    if (this.guild || guildID) path = path.guilds(this.guild?.id ?? guildID);
    return id ? path.commands(id) : path.commands;
  }

  /**
   * Data that resolves to give an ApplicationCommand object. This can be:
   * * An ApplicationCommand object
   * * A Snowflake
   * @typedef {ApplicationCommand|Snowflake} ApplicationCommandResolvable
   */

  /**
   * Options used to fetch data from discord
   * @typedef {Object} BaseFetchOptions
   * @property {boolean} [cache=true] Whether to cache the fetched data if it wasn't already
   * @property {boolean} [force=false] Whether to skip the cache check and request the API
   */

  /**
   * Options used to fetch Application Commands from discord
   * @typedef {BaseFetchOptions} FetchApplicationCommandOptions
   * @property {Snowflake} [guildID] ID of the guild to fetch commands for, for when the guild is not cached
   */

  /**
   * Obtains one or multiple application commands from Discord, or the cache if it's already available.
   * @param {Snowflake} [id] ID of the application command
   * @param {FetchApplicationCommandOptions} [options] Additional options for this fetch
   * @returns {Promise<ApplicationCommand|Collection<Snowflake, ApplicationCommand>>}
   * @example
   * // Fetch a single command
   * client.application.commands.fetch('123456789012345678')
   *   .then(command => console.log(`Fetched command ${command.name}`))
   *   .catch(console.error);
   * @example
   * // Fetch all commands
   * guild.commands.fetch()
   *   .then(commands => console.log(`Fetched ${commands.size} commands`))
   *   .catch(console.error);
   */
  async fetch(id, { guildID, cache = true, force = false } = {}) {
    if (typeof id === 'object') {
      ({ guildID, cache = true, force = false } = id);
      id = undefined;
    }
    if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const command = await this.commandPath({ id, guildID }).get();
      return this.add(command, cache);
    }

    const data = await this.commandPath({ guildID }).get();
    return data.reduce((coll, command) => coll.set(command.id, this.add(command, cache)), new Collection());
  }

  /**
   * Creates an application command.
   * @param {ApplicationCommandData} command The command
   * @param {Snowflake} [guildID] ID of the guild to create this command in,
   * ignored when using a {@link GuildApplicationCommandManager}
   * @returns {Promise<ApplicationCommand>}
   * @example
   * // Create a new command
   * client.application.commands.create({
   *   name: 'test',
   *   description: 'A test command',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async create(command, guildID) {
    const data = await this.commandPath({ guildID }).post({
      data: this.constructor.transformCommand(command),
    });
    return this.add(data);
  }

  /**
   * Sets all the commands for this application or guild.
   * @param {ApplicationCommandData[]} commands The commands
   * @param {Snowflake} [guildID] ID of the guild to create the commands in,
   * ignored when using a {@link GuildApplicationCommandManager}
   * @returns {Promise<Collection<Snowflake, ApplicationCommand>>}
   * @example
   * // Set all commands to just this one
   * client.application.commands.set([
   *   {
   *     name: 'test',
   *     description: 'A test command',
   *   },
   * ])
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Remove all commands
   * guild.commands.set([])
   *   .then(console.log)
   *   .catch(console.error);
   */
  async set(commands, guildID) {
    const data = await this.commandPath({ guildID }).put({
      data: commands.map(c => this.constructor.transformCommand(c)),
    });
    return data.reduce((coll, command) => coll.set(command.id, this.add(command)), new Collection());
  }

  /**
   * Edits an application command.
   * @param {ApplicationCommandResolvable} command The command to edit
   * @param {ApplicationCommandData} data The data to update the command with
   * @param {Snowflake} [guildID] ID of the guild where the command registered,
   * ignored when using a {@link GuildApplicationCommandManager}
   * @returns {Promise<ApplicationCommand>}
   * @example
   * // Edit an existing command
   * client.application.commands.edit('123456789012345678', {
   *   description: 'New description',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async edit(command, data, guildID) {
    const id = this.resolveID(command);
    if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    const patched = await this.commandPath({ id, guildID }).patch({ data: this.constructor.transformCommand(data) });
    return this.add(patched);
  }

  /**
   * Deletes an application command.
   * @param {ApplicationCommandResolvable} command The command to delete
   * @param {Snowflake} [guildID] ID of the guild where the command is registered,
   * ignored when using a {@link GuildApplicationCommandManager}
   * @returns {Promise<?ApplicationCommand>}
   * @example
   * // Delete a command
   * guild.commands.delete('123456789012345678')
   *   .then(console.log)
   *   .catch(console.error);
   */
  async delete(command, guildID) {
    const id = this.resolveID(command);
    if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    await this.commandPath({ id, guildID }).delete();

    const cached = this.cache.get(id);
    this.cache.delete(id);
    return cached ?? null;
  }

  /**
   * Transforms an {@link ApplicationCommandData} object into something that can be used with the API.
   * @param {ApplicationCommandData} command The command to transform
   * @returns {APIApplicationCommand}
   * @private
   */
  static transformCommand(command) {
    return {
      name: command.name,
      description: command.description,
      options: command.options?.map(o => ApplicationCommand.transformOption(o)),
      default_permission: command.defaultPermission,
    };
  }

  /**
   * Fetches the permissions for one or multiple commands.
   * <warn>When calling this on ApplicationCommandManager, guildID is required.
   * To fetch all permissions for an uncached guild use `fetchPermissions(undefined, '123456789012345678')`</warn>
   * @param {ApplicationCommandResolvable} [command] The command to get the permissions from
   * @param {Snowflake} [guildID] ID of the guild to get the permissions for,
   * ignored when using a {@link GuildApplicationCommandManager}
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
  async fetchPermissions(command, guildID) {
    if (!this.guild && !guildID) throw new Error('GLOBAL_COMMAND_PERMISSIONS');
    if (command) {
      const id = this.resolveID(command);
      if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

      const data = await this.commandPath({ id, guildID }).permissions.get();
      return data.permissions.map(perm => this.constructor.transformPermissions(perm, true));
    }

    const data = await this.commandPath({ guildID }).permissions.get();
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
   * @prop {Snowflake} id The ID of the command
   * @prop {ApplicationCommandPermissionData[]} permissions The permissions for this command
   */

  /**
   * Sets the permissions for a command.
   * <warn>When calling this on ApplicationCommandManager, guildID is required.
   * To set multiple permissions for an uncached guild use `setPermissions(permissions, '123456789012345678')`</warn>
   * @param {ApplicationCommandResolvable|GuildApplicationCommandPermissionData[]} command The command to edit the
   * permissions for, or an array of guild application command permissions to set the permissions of all commands
   * @param {ApplicationCommandPermissionData[]} [permissions] The new permissions for the command
   * @param {Snowflake} [guildID] ID of the guild to get the permissions for,
   * ignored when using a {@link GuildApplicationCommandManager}
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
  async setPermissions(command, permissions, guildID) {
    const id = this.resolveID(command);

    if (id) {
      if (!this.guild && !guildID) throw new Error('GLOBAL_COMMAND_PERMISSIONS');
      const data = await this.commandPath({ id, guildID }).permissions.put({
        data: { permissions: permissions.map(perm => this.constructor.transformPermissions(perm)) },
      });
      return data.permissions.map(perm => this.constructor.transformPermissions(perm, true));
    }

    if (typeof permissions === 'string') {
      guildID = permissions;
      permissions = undefined;
    }

    if (!this.guild && !guildID) throw new Error('GLOBAL_COMMAND_PERMISSIONS');

    const data = await this.commandPath({ guildID }).permissions.put({
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

module.exports = ApplicationCommandManager;

/**
 * @external APIApplicationCommandPermissions
 * @see {@link https://discord.com/developers/docs/interactions/slash-commands#applicationcommandpermissions}
 */
