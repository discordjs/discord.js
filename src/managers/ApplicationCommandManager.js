'use strict';

const BaseManager = require('./BaseManager');
const { TypeError } = require('../errors');
const ApplicationCommand = require('../structures/ApplicationCommand');
const Collection = require('../util/Collection');

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
   * @example
   * // Create a new command
   * client.application.commands.create({
   *   name: 'test',
   *   description: 'A test command',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async create(command) {
    const data = await this.commandPath.post({
      data: this.constructor.transformCommand(command),
    });
    return this.add(data);
  }

  /**
   * Sets all the commands for this application or guild.
   * @param {ApplicationCommandData[]} commands The commands
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
  async set(commands) {
    const data = await this.commandPath.put({
      data: commands.map(c => this.constructor.transformCommand(c)),
    });
    return data.reduce((coll, command) => coll.set(command.id, this.add(command)), new Collection());
  }

  /**
   * Edits an application command.
   * @param {ApplicationCommandResolvable} command The command to edit
   * @param {ApplicationCommandData} data The data to update the command with
   * @returns {Promise<ApplicationCommand>}
   * @example
   * // Edit an existing command
   * client.application.commands.edit('123456789012345678', {
   *   description: 'New description',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async edit(command, data) {
    const id = this.resolveID(command);
    if (!id) throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');

    const patched = await this.commandPath(id).patch({ data: this.constructor.transformCommand(data) });
    return this.add(patched);
  }

  /**
   * Deletes an application command.
   * @param {ApplicationCommandResolvable} command The command to delete
   * @returns {Promise<?ApplicationCommand>}
   * @example
   * // Delete a command
   * guild.commands.delete('123456789012345678')
   *   .then(console.log)
   *   .catch(console.error);
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
   * Transforms an {@link ApplicationCommandData} object into something that can be used with the API.
   * @param {ApplicationCommandData} command The command to transform
   * @returns {Object}
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
}

module.exports = ApplicationCommandManager;
