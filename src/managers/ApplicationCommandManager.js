'use strict';

const BaseManager = require('./BaseManager');
const { TypeError } = require('../errors');
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
   * @type {Object}
   * @readonly
   * @private
   */
  get commandPath() {
    let path = this.client.api.applications(this.client.application.id);
    if (this.guild) path = path.guilds(this.guild.id);
    return path.commands;
  }

  /**
   * Data that resolves to give an ApplicationCommand object. This can be:
   * * An ApplicationCommand object
   * * A Snowflake
   * @typedef {ApplicationCommand|Snowflake} ApplicationCommandResolvable
   */

  /**
   * Obtains one or multiple application commands from Discord, or the cache if it's already available.
   * @param {Snowflake} [id] ID of the application command
   * @param {boolean} [cache=true] Whether to cache the new application commands if they weren't already
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<ApplicationCommand|Collection<Snowflake, ApplicationCommand>>}
   */
  async fetch(id, cache = true, force = false) {
    if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const command = await this.commandPath(id).get();
      return this.add(command, cache);
    }

    const data = await this.commandPath.get();
    return data.reduce((coll, command) => coll.set(command.id, this.add(command, cache)), new Collection());
  }

  /**
   * Creates an application command.
   * @param {ApplicationCommandData} command The command
   * @returns {Promise<ApplicationCommand>}
   */
  async create(command) {
    const data = await this.commandPath.post({
      data: ApplicationCommandManager.transformCommand(command),
    });
    return this.add(data);
  }

  /**
   * Sets all the commands for this application or guild.
   * @param {ApplicationCommandData[]} commands The commands
   * @returns {Promise<Collection<Snowflake, ApplicationCommand>>}
   */
  async set(commands) {
    const data = await this.commandPath.put({
      data: commands.map(ApplicationCommandManager.transformCommand),
    });
    return data.reduce((coll, command) => coll.set(command.id, this.add(command)), new Collection());
  }

  /**
   * Edits an application command.
   * @param {ApplicationCommandResolvable} command The command to edit
   * @param {ApplicationCommandData} data The data to update the command with
   * @returns {Promise<ApplicationCommand>}
   */
  async edit(command, data) {
    const id = this.resolveID(command);
    if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    const raw = {};
    if (data.name) raw.name = data.name;
    if (data.description) raw.description = data.description;
    if (data.options) raw.options = data.options.map(ApplicationCommand.transformOption);
    if (data.defaultPermission) raw.default_permission = data.defaultPermission;

    const patched = await this.commandPath(id).patch({ data: raw });
    return this.add(patched);
  }

  /**
   * Deletes an application command.
   * @param {ApplicationCommandResolvable} command The command to delete
   * @returns {Promise<?ApplicationCommand>}
   */
  async delete(command) {
    const id = this.resolveID(command);
    if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    await this.commandPath(id).delete();

    const cached = this.cache.get(id);
    this.cache.delete(id);
    return cached ?? null;
  }

  /**
   * Fetches the permissions for one or multiple commands.
   * @param {ApplicationCommandResolvable} [command] The command to get the permissions from
   * @returns {Promise<ApplicationCommandPermissions[]|Collection<Snowflake, ApplicationCommandPermissions[]>>}
   */
  async fetchPermissions(command) {
    if (command) {
      const id = this.resolveID(command);
      if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

      const data = await this.commandPath(id).permissions.get();
      return data.permissions.map(o => ApplicationCommandManager.transformPermissions(o, true));
    }

    const commands = await this.commandPath.permissions.get();
    return commands.reduce(
      (coll, data) =>
        coll.set(
          data.id,
          data.permissions.map(o => ApplicationCommandManager.transformPermissions(o, true)),
        ),
      new Collection(),
    );
  }

  /**
   * Sets the permissions for a command.
   * @param {ApplicationCommandResolvable} command The command to edit the permissions for
   * @param {ApplicationCommandPermissions[]} permissions The new permissions for the command
   * @returns {Promise<?ApplicationCommand>}
   */
  async setPermissions(command, permissions) {
    const id = this.resolveID(command);
    if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    await this.commandPath(id).permissions.put({
      data: { permissions: permissions.map(ApplicationCommandManager.transformPermissions) },
    });
    return this.cache.get(id) ?? null;
  }

  /**
   * Transforms an {@link ApplicationCommandData} object into something that can be used with the API.
   * @param {ApplicationCommandData} command The command to transform
   * @returns {Object}
   * @private
   */
  static transformCommand(command) {
    return {
      ...command,
      options: command.options?.map(ApplicationCommand.transformOption),
      default_permission: command.defaultPermission,
    };
  }

  /**
   * Transforms an {@link ApplicationCommandPermissionData} object into something that can be used with the API.
   * @param {ApplicationCommandPermissionData} permissions The permissions to transform
   * @param {boolean} [received] Whether this permissions have been received from Discord
   * @returns {Object}
   * @private
   */
  static transformPermissions(permissions, received) {
    return {
      ...permissions,
      type:
        permissions.type === 'number' && !received
          ? permissions.type
          : ApplicationCommandPermissionTypes[permissions.type],
    };
  }
}

module.exports = ApplicationCommandManager;
