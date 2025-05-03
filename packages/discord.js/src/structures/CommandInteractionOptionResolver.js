'use strict';

const { ApplicationCommandOptionType } = require('discord-api-types/v10');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');

/**
 * A resolver for command interaction options.
 */
class CommandInteractionOptionResolver {
  constructor(client, options, resolved) {
    /**
     * The client that instantiated this.
     *
     * @name CommandInteractionOptionResolver#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The name of the subcommand group.
     *
     * @type {?string}
     * @private
     */
    this._group = null;

    /**
     * The name of the subcommand.
     *
     * @type {?string}
     * @private
     */
    this._subcommand = null;

    /**
     * The bottom-level options for the interaction.
     * If there is a subcommand (or subcommand and group), this is the options for the subcommand.
     *
     * @type {CommandInteractionOption[]}
     * @private
     */
    this._hoistedOptions = options;

    // Hoist subcommand group if present
    if (this._hoistedOptions[0]?.type === ApplicationCommandOptionType.SubcommandGroup) {
      this._group = this._hoistedOptions[0].name;
      this._hoistedOptions = this._hoistedOptions[0].options ?? [];
    }

    // Hoist subcommand if present
    if (this._hoistedOptions[0]?.type === ApplicationCommandOptionType.Subcommand) {
      this._subcommand = this._hoistedOptions[0].name;
      this._hoistedOptions = this._hoistedOptions[0].options ?? [];
    }

    /**
     * The interaction options array.
     *
     * @name CommandInteractionOptionResolver#data
     * @type {ReadonlyArray<CommandInteractionOption>}
     * @readonly
     */
    Object.defineProperty(this, 'data', { value: Object.freeze([...options]) });

    /**
     * The interaction resolved data
     *
     * @name CommandInteractionOptionResolver#resolved
     * @type {?Readonly<CommandInteractionResolvedData>}
     */
    Object.defineProperty(this, 'resolved', { value: resolved ? Object.freeze(resolved) : null });
  }

  /**
   * Gets an option by its name.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?CommandInteractionOption} The option, if found.
   */
  get(name, required = false) {
    const option = this._hoistedOptions.find(opt => opt.name === name);
    if (!option) {
      if (required) {
        throw new DiscordjsTypeError(ErrorCodes.CommandInteractionOptionNotFound, name);
      }

      return null;
    }

    return option;
  }

  /**
   * Gets an option by name and property and checks its type.
   *
   * @param {string} name The name of the option.
   * @param {ApplicationCommandOptionType[]} allowedTypes The allowed types of the option.
   * @param {string[]} properties The properties to check for for `required`.
   * @param {boolean} required Whether to throw an error if the option is not found.
   * @returns {?CommandInteractionOption} The option, if found.
   * @private
   */
  _getTypedOption(name, allowedTypes, properties, required) {
    const option = this.get(name, required);
    if (!option) {
      return null;
    } else if (!allowedTypes.includes(option.type)) {
      throw new DiscordjsTypeError(ErrorCodes.CommandInteractionOptionType, name, option.type, allowedTypes.join(', '));
    } else if (required && properties.every(prop => option[prop] === null || option[prop] === undefined)) {
      throw new DiscordjsTypeError(ErrorCodes.CommandInteractionOptionEmpty, name, option.type);
    }

    return option;
  }

  /**
   * Gets the selected subcommand.
   *
   * @param {boolean} [required=true] Whether to throw an error if there is no subcommand.
   * @returns {?string} The name of the selected subcommand, or null if not set and not required.
   */
  getSubcommand(required = true) {
    if (required && !this._subcommand) {
      throw new DiscordjsTypeError(ErrorCodes.CommandInteractionOptionNoSubcommand);
    }

    return this._subcommand;
  }

  /**
   * Gets the selected subcommand group.
   *
   * @param {boolean} [required=false] Whether to throw an error if there is no subcommand group.
   * @returns {?string} The name of the selected subcommand group, or null if not set and not required.
   */
  getSubcommandGroup(required = false) {
    if (required && !this._group) {
      throw new DiscordjsTypeError(ErrorCodes.CommandInteractionOptionNoSubcommandGroup);
    }

    return this._group;
  }

  /**
   * Gets a boolean option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?boolean} The value of the option, or null if not set and not required.
   */
  getBoolean(name, required = false) {
    const option = this._getTypedOption(name, [ApplicationCommandOptionType.Boolean], ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a channel option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @param {ChannelType[]} [channelTypes=[]] The allowed types of channels. If empty, all channel types are allowed.
   * @returns {?(GuildChannel|ThreadChannel|APIChannel)}
   * The value of the option, or null if not set and not required.
   */
  getChannel(name, required = false, channelTypes = []) {
    const option = this._getTypedOption(name, [ApplicationCommandOptionType.Channel], ['channel'], required);
    const channel = option?.channel ?? null;

    if (channel && channelTypes.length > 0 && !channelTypes.includes(channel.type)) {
      throw new DiscordjsTypeError(
        ErrorCodes.CommandInteractionOptionInvalidChannelType,
        name,
        channel.type,
        channelTypes.join(', '),
      );
    }

    return channel;
  }

  /**
   * Gets a string option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?string} The value of the option, or null if not set and not required.
   */
  getString(name, required = false) {
    const option = this._getTypedOption(name, [ApplicationCommandOptionType.String], ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets an integer option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getInteger(name, required = false) {
    const option = this._getTypedOption(name, [ApplicationCommandOptionType.Integer], ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a number option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getNumber(name, required = false) {
    const option = this._getTypedOption(name, [ApplicationCommandOptionType.Number], ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a user option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?User} The value of the option, or null if not set and not required.
   */
  getUser(name, required = false) {
    const option = this._getTypedOption(
      name,
      [ApplicationCommandOptionType.User, ApplicationCommandOptionType.Mentionable],
      ['user'],
      required,
    );
    return option?.user ?? null;
  }

  /**
   * Gets a member option.
   *
   * @param {string} name The name of the option.
   * @returns {?(GuildMember|APIGuildMember)}
   * The value of the option, or null if the user is not present in the guild or the option is not set.
   */
  getMember(name) {
    const option = this._getTypedOption(
      name,
      [ApplicationCommandOptionType.User, ApplicationCommandOptionType.Mentionable],
      ['member'],
      false,
    );
    return option?.member ?? null;
  }

  /**
   * Gets a role option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(Role|APIRole)} The value of the option, or null if not set and not required.
   */
  getRole(name, required = false) {
    const option = this._getTypedOption(
      name,
      [ApplicationCommandOptionType.Role, ApplicationCommandOptionType.Mentionable],
      ['role'],
      required,
    );
    return option?.role ?? null;
  }

  /**
   * Gets an attachment option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?Attachment} The value of the option, or null if not set and not required.
   */
  getAttachment(name, required = false) {
    const option = this._getTypedOption(name, [ApplicationCommandOptionType.Attachment], ['attachment'], required);
    return option?.attachment ?? null;
  }

  /**
   * Gets a mentionable option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(User|GuildMember|APIGuildMember|Role|APIRole)}
   * The value of the option, or null if not set and not required.
   */
  getMentionable(name, required = false) {
    const option = this._getTypedOption(
      name,
      [ApplicationCommandOptionType.Mentionable],
      ['user', 'member', 'role'],
      required,
    );
    return option?.member ?? option?.user ?? option?.role ?? null;
  }

  /**
   * Gets a message option.
   *
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?Message}
   * The value of the option, or null if not set and not required.
   */
  getMessage(name, required = false) {
    const option = this._getTypedOption(name, ['_MESSAGE'], ['message'], required);
    return option?.message ?? null;
  }

  /**
   * The full autocomplete option object.
   *
   * @typedef {Object} AutocompleteFocusedOption
   * @property {string} name The name of the option
   * @property {ApplicationCommandOptionType} type The type of the application command option
   * @property {string} value The value of the option
   * @property {boolean} focused Whether this option is currently in focus for autocomplete
   */

  /**
   * Gets the focused option.
   *
   * @returns {AutocompleteFocusedOption}
   * The whole object of the option that is focused
   */
  getFocused() {
    const focusedOption = this._hoistedOptions.find(option => option.focused);
    if (!focusedOption) throw new DiscordjsTypeError(ErrorCodes.AutocompleteInteractionOptionNoFocusedOption);
    return focusedOption;
  }
}

exports.CommandInteractionOptionResolver = CommandInteractionOptionResolver;
