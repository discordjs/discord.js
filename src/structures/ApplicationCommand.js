'use strict';

const Base = require('./Base');
const { Error } = require('../errors');
const { ApplicationCommandOptionTypes } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents an application command.
 * @extends {Base}
 */
class ApplicationCommand extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The ID of this command
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The guild this command is part of
     * @type {?Guild}
     */
    this.guild = guild ?? null;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The name of this command
     * @type {string}
     */
    this.name = data.name;

    /**
     * The description of this command
     * @type {string}
     */
    this.description = data.description;

    /**
     * The options of this command
     * @type {ApplicationCommandOption[]}
     */
    this.options = data.options?.map(o => this.constructor.transformOption(o, true)) ?? [];

    /**
     * Whether the command is enabled by default when the app is added to a guild
     * @type {boolean}
     */
    this.defaultPermission = data.default_permission;
  }

  /**
   * The timestamp the command was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
  }

  /**
   * The time the command was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The manager that this command belongs to
   * @type {ApplicationCommandManager}
   * @readonly
   */
  get manager() {
    return (this.guild ?? this.client.application).commands;
  }

  /**
   * Data for creating or editing an application command.
   * @typedef {Object} ApplicationCommandData
   * @property {string} name The name of the command
   * @property {string} description The description of the command
   * @property {ApplicationCommandOptionData[]} [options] Options for the command
   * @property {boolean} [defaultPermission] Whether the command is enabled by default when the app is added to a guild
   */

  /**
   * An option for an application command or subcommand.
   * @typedef {Object} ApplicationCommandOptionData
   * @property {ApplicationCommandOptionType|number} type The type of the option
   * @property {string} name The name of the option
   * @property {string} description The description of the option
   * @property {boolean} [required] Whether the option is required
   * @property {ApplicationCommandOptionChoice[]} [choices] The choices of the option for the user to pick from
   * @property {ApplicationCommandOptionData[]} [options] Additional options if this option is a subcommand (group)
   */

  /**
   * Edits this application command.
   * @param {ApplicationCommandData} data The data to update the command with
   * @returns {Promise<ApplicationCommand>}
   * @example
   * // Edit the description of this command
   * command.edit({
   *   description: 'New description',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  edit(data) {
    return this.manager.edit(this, data);
  }

  /**
   * Deletes this command.
   * @returns {Promise<ApplicationCommand>}
   * @example
   * // Delete this command
   * command.delete()
   *   .then(console.log)
   *   .catch(console.error);
   */
  delete() {
    return this.manager.delete(this);
  }

  /**
   * Data for setting the permissions of an application command.
   * @typedef {object} ApplicationCommandPermissionData
   * @property {Snowflake} id The ID of the role or user
   * @property {ApplicationCommandPermissionType|number} type Whether this permission if for a role or a user
   * @property {boolean} permission Whether the role or user has the permission to use this command
   */

  /**
   * The object returned when fetching permissions for an application command.
   * @typedef {object} ApplicationCommandPermissions
   * @property {Snowflake} id The ID of the role or user
   * @property {ApplicationCommandPermissionType} type Whether this permission if for a role or a user
   * @property {boolean} permission Whether the role or user has the permission to use this command
   */

  /**
   * Fetches the permissions for this command.
   * <warn>This is only available for guild application commands.</warn>
   * @returns {Promise<ApplicationCommandPermissions[]>}
   * @example
   * // Fetch permissions for this command
   * command.fetchPermissions()
   *   .then(perms => console.log(`Fetched permissions for ${perms.length} users`))
   *   .catch(console.error);
   */
  fetchPermissions() {
    if (!this.guild) throw new Error('GLOBAL_COMMAND_PERMISSIONS');
    return this.manager.fetchPermissions(this);
  }

  /**
   * Sets the permissions for this command.
   * <warn>This is only available for guild application commands.</warn>
   * @param {ApplicationCommandPermissionData[]} permissions The new permissions for the command
   * @returns {Promise<ApplicationCommandPermissions[]>}
   * @example
   * // Set the permissions for this command
   * command.setPermissions([
   *   {
   *     id: '876543210987654321',
   *     type: 'USER',
   *     permission: false,
   *   },
   * ])
   *   .then(console.log)
   *   .catch(console.error);
   */
  setPermissions(permissions) {
    if (!this.guild) throw new Error('GLOBAL_COMMAND_PERMISSIONS');
    return this.manager.setPermissions(this, permissions);
  }

  /**
   * An option for an application command or subcommand.
   * @typedef {Object} ApplicationCommandOption
   * @property {ApplicationCommandOptionType} type The type of the option
   * @property {string} name The name of the option
   * @property {string} description The description of the option
   * @property {boolean} [required] Whether the option is required
   * @property {ApplicationCommandOptionChoice[]} [choices] The choices of the option for the user to pick from
   * @property {ApplicationCommandOption[]} [options] Additional options if this option is a subcommand (group)
   */

  /**
   * A choice for an application command option.
   * @typedef {Object} ApplicationCommandOptionChoice
   * @property {string} name The name of the choice
   * @property {string|number} value The value of the choice
   */

  /**
   * Transforms an {@link ApplicationCommandOptionData} object into something that can be used with the API.
   * @param {ApplicationCommandOptionData} option The option to transform
   * @param {boolean} [received] Whether this option has been received from Discord
   * @returns {Object}
   * @private
   */
  static transformOption(option, received) {
    return {
      type: typeof option.type === 'number' && !received ? option.type : ApplicationCommandOptionTypes[option.type],
      name: option.name,
      description: option.description,
      required: option.required,
      choices: option.choices,
      options: option.options?.map(o => this.transformOption(o, received)),
    };
  }
}

module.exports = ApplicationCommand;
