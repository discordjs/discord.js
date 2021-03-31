'use strict';

const BaseManager = require('./BaseManager');
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
    let path = this.client.api.applications(this.client.application.id);
    if (this.guild) {
      path = path.guilds(this.guild.id);
    }

    if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const command = await path.commands(id).get();
      return this.add(command, cache);
    }

    const data = await path.commands.get();
    const commands = new Collection();
    for (const command of data) commands.set(command.id, this.add(command, cache));
    return commands;
  }

  /**
   * Creates an application command.
   * @param {ApplicationCommandData} command The command
   * @returns {Promise<ApplicationCommand>}
   */
  async create(command) {
    let path = this.client.api.applications(this.client.application.id);
    if (this.guild) {
      path = path.guilds(this.guild.id);
    }

    const data = await path.commands.post({
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
    let path = this.client.api.applications(this.client.application.id);
    if (this.guild) {
      path = path.guilds(this.guild.id);
    }

    const data = await path.commands.put({
      data: commands.map(ApplicationCommandManager.transformCommand),
    });
    return data.reduce((coll, command) => coll.set(command.id, this.add(command)), new Collection());
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
    };
  }
}

module.exports = ApplicationCommandManager;
