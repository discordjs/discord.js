'use strict';

const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { isJSONEncodable } = require('@discordjs/util');
const { Routes } = require('discord-api-types/v10');
const ApplicationCommandPermissionsManager = require('./ApplicationCommandPermissionsManager');
const CachedManager = require('./CachedManager');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const ApplicationCommand = require('../structures/ApplicationCommand');
const PermissionsBitField = require('../util/PermissionsBitField');

/**
 * Manages API methods for application commands and stores their cache.
 * @extends {CachedManager}
 */
class ApplicationCommandManager extends CachedManager {
  constructor(client, iterable) {
    super(client, ApplicationCommand, iterable);

    /**
     * The manager for permissions of arbitrary commands on arbitrary guilds
     * @type {ApplicationCommandPermissionsManager}
     */
    this.permissions = new ApplicationCommandPermissionsManager(this);
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, ApplicationCommand>}
   * @name ApplicationCommandManager#cache
   */

  _add(data, cache, guildId) {
    return super._add(data, cache, { extras: [this.guild, guildId] });
  }

  /**
   * The APIRouter path to the commands
   * @param {Snowflake} [options.id] The application command's id
   * @param {Snowflake} [options.guildId] The guild's id to use in the path,
   * ignored when using a {@link GuildApplicationCommandManager}
   * @returns {string}
   * @private
   */
  commandPath({ id, guildId } = {}) {
    if (this.guild ?? guildId) {
      if (id) {
        return Routes.applicationGuildCommand(this.client.application.id, this.guild?.id ?? guildId, id);
      }

      return Routes.applicationGuildCommands(this.client.application.id, this.guild?.id ?? guildId);
    }

    if (id) {
      return Routes.applicationCommand(this.client.application.id, id);
    }

    return Routes.applicationCommands(this.client.application.id);
  }

  /**
   * Data that resolves to give an ApplicationCommand object. This can be:
   * * An ApplicationCommand object
   * * A Snowflake
   * @typedef {ApplicationCommand|Snowflake} ApplicationCommandResolvable
   */

  /**
   * Data that resolves to the data of an ApplicationCommand
   * @typedef {ApplicationCommandData|APIApplicationCommand} ApplicationCommandDataResolvable
   */

  /**
   * Options used to fetch data from Discord
   * @typedef {Object} BaseFetchOptions
   * @property {boolean} [cache=true] Whether to cache the fetched data if it wasn't already
   * @property {boolean} [force=false] Whether to skip the cache check and request the API
   */

  /**
   * Options used to fetch Application Commands from Discord
   * @typedef {BaseFetchOptions} FetchApplicationCommandOptions
   * @property {Snowflake} [guildId] The guild's id to fetch commands for, for when the guild is not cached
   * @property {LocaleString} [locale] The locale to use when fetching this command
   * @property {boolean} [withLocalizations] Whether to fetch all localization data
   */

  /**
   * Obtains one or multiple application commands from Discord, or the cache if it's already available.
   * @param {Snowflake|FetchApplicationCommandOptions} [id] Options for fetching application command(s)
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
  async fetch(id, { guildId, cache = true, force = false, locale, withLocalizations } = {}) {
    if (typeof id === 'object') {
      ({ guildId, cache = true, locale, withLocalizations } = id);
    } else if (id) {
      if (!force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const command = await this.client.rest.get(this.commandPath({ id, guildId }));
      return this._add(command, cache);
    }

    const data = await this.client.rest.get(this.commandPath({ guildId }), {
      headers: {
        'X-Discord-Locale': locale,
      },
      query: makeURLSearchParams({ with_localizations: withLocalizations }),
    });
    return data.reduce((coll, command) => coll.set(command.id, this._add(command, cache, guildId)), new Collection());
  }

  /**
   * Creates an application command.
   * @param {ApplicationCommandDataResolvable} command The command
   * @param {Snowflake} [guildId] The guild's id to create this command in,
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
  async create(command, guildId) {
    const data = await this.client.rest.post(this.commandPath({ guildId }), {
      body: this.constructor.transformCommand(command),
    });
    return this._add(data, true, guildId);
  }

  /**
   * Sets all the commands for this application or guild.
   * @param {ApplicationCommandDataResolvable[]} commands The commands
   * @param {Snowflake} [guildId] The guild's id to create the commands in,
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
  async set(commands, guildId) {
    const data = await this.client.rest.put(this.commandPath({ guildId }), {
      body: commands.map(command => this.constructor.transformCommand(command)),
    });
    return data.reduce(
      (collection, command) => collection.set(command.id, this._add(command, true, guildId)),
      new Collection(),
    );
  }

  /**
   * Edits an application command.
   * @param {ApplicationCommandResolvable} command The command to edit
   * @param {Partial<ApplicationCommandDataResolvable>} data The data to update the command with
   * @param {Snowflake} [guildId] The guild's id where the command registered,
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
  async edit(command, data, guildId) {
    const id = this.resolveId(command);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'command', 'ApplicationCommandResolvable');

    const patched = await this.client.rest.patch(this.commandPath({ id, guildId }), {
      body: this.constructor.transformCommand(data),
    });
    return this._add(patched, true, guildId);
  }

  /**
   * Deletes an application command.
   * @param {ApplicationCommandResolvable} command The command to delete
   * @param {Snowflake} [guildId] The guild's id where the command is registered,
   * ignored when using a {@link GuildApplicationCommandManager}
   * @returns {Promise<?ApplicationCommand>}
   * @example
   * // Delete a command
   * guild.commands.delete('123456789012345678')
   *   .then(console.log)
   *   .catch(console.error);
   */
  async delete(command, guildId) {
    const id = this.resolveId(command);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'command', 'ApplicationCommandResolvable');

    await this.client.rest.delete(this.commandPath({ id, guildId }));

    const cached = this.cache.get(id);
    this.cache.delete(id);
    return cached ?? null;
  }

  /**
   * Transforms an {@link ApplicationCommandData} object into something that can be used with the API.
   * @param {ApplicationCommandDataResolvable} command The command to transform
   * @returns {APIApplicationCommand}
   * @private
   */
  static transformCommand(command) {
    if (isJSONEncodable(command)) return command.toJSON();

    let default_member_permissions;

    if ('default_member_permissions' in command) {
      default_member_permissions = command.default_member_permissions
        ? new PermissionsBitField(BigInt(command.default_member_permissions)).bitfield.toString()
        : command.default_member_permissions;
    }

    if ('defaultMemberPermissions' in command) {
      default_member_permissions =
        command.defaultMemberPermissions !== null
          ? new PermissionsBitField(command.defaultMemberPermissions).bitfield.toString()
          : command.defaultMemberPermissions;
    }

    return {
      name: command.name,
      name_localizations: command.nameLocalizations ?? command.name_localizations,
      description: command.description,
      nsfw: command.nsfw,
      description_localizations: command.descriptionLocalizations ?? command.description_localizations,
      type: command.type,
      options: command.options?.map(option => ApplicationCommand.transformOption(option)),
      default_member_permissions,
      dm_permission: command.dmPermission ?? command.dm_permission,
      integration_types: command.integrationTypes ?? command.integration_types,
      contexts: command.contexts,
    };
  }
}

module.exports = ApplicationCommandManager;
