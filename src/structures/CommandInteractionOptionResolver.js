'use strict';

const { TypeError } = require('../errors');

/**
 * A resolver for command interaction options.
 */
class CommandInteractionOptionResolver {
  constructor(client, options) {
    /**
     * The client that instantiated this.
     * @name CommandInteractionOptionResolver#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The interaction options array.
     * @type {CommandInteractionOption[]}
     * @private
     */
    this._options = options ?? [];
  }

  /**
   * Gets an option by its name.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?CommandInteractionOption} The option, if found.
   */
  get(name, required = false) {
    const option = this._options.find(opt => opt.name === name);
    if (!option) {
      if (required) {
        throw new TypeError('COMMAND_INTERACTION_OPTION_NOT_FOUND', name);
      }
      return null;
    }
    return option;
  }

  /**
   * Gets an option by name and property and checks its type.
   * @param {string} name The name of the option.
   * @param {ApplicationCommandOptionType[]} types The type of the option.
   * @param {string[]} properties The property to check for for `required`.
   * @param {boolean} required Whether to throw an error if the option is not found.
   * @returns {?CommandInteractionOption} The option, if found.
   * @private
   */
  _getTypedOption(name, types, properties, required) {
    const option = this.get(name, required);
    if (!option) {
      return null;
    } else if (!types.includes(option.type)) {
      throw new TypeError('COMMAND_INTERACTION_OPTION_TYPE', name, option.type, types);
    } else if (required && properties.every(prop => option[prop] === null || typeof option[prop] === 'undefined')) {
      throw new TypeError('COMMAND_INTERACTION_OPTION_EMPTY', name, option.type);
    }
    return option;
  }

  /**
   * Gets a sub-command or sub-command group.
   * @param {string} name The name of the sub-command or sub-command group.
   * @returns {?CommandInteractionOptionResolver}
   * A new resolver for the sub-command/group's options, or null if empty
   */
  getSubCommand(name) {
    const option = this._getTypedOption(name, ['SUB_COMMAND', 'SUB_COMMAND_GROUP'], ['options'], false);
    return option && new CommandInteractionOptionResolver(this.client, option.options);
  }

  /**
   * Gets a boolean option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?boolean} The value of the option, or null if not set and not required.
   */
  getBoolean(name, required = false) {
    const option = this._getTypedOption(name, ['BOOLEAN'], ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a channel option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(GuildChannel|APIInteractionDataResolvedChannel)}
   * The value of the option, or null if not set and not required.
   */
  getChannel(name, required = false) {
    const option = this._getTypedOption(name, ['CHANNEL'], ['channel'], required);
    return option?.channel ?? null;
  }

  /**
   * Gets a string option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?string} The value of the option, or null if not set and not required.
   */
  getString(name, required = false) {
    const option = this._getTypedOption(name, ['STRING'], ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets an integer option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getInteger(name, required = false) {
    const option = this._getTypedOption(name, ['INTEGER'], ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a user option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?User} The value of the option, or null if not set and not required.
   */
  getUser(name, required = false) {
    const option = this._getTypedOption(name, ['USER'], ['user'], required);
    return option?.user ?? null;
  }

  /**
   * Gets a member option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(GuildMember|APIInteractionDataResolvedGuildMember)}
   * The value of the option, or null if not set and not required.
   */
  getMember(name, required = false) {
    const option = this._getTypedOption(name, ['MEMBER'], ['member'], required);
    return option?.member ?? null;
  }

  /**
   * Gets a role option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(Role|APIRole)} The value of the option, or null if not set and not required.
   */
  getRole(name, required = false) {
    const option = this._getTypedOption(name, ['ROLE'], ['role'], required);
    return option?.role ?? null;
  }

  /**
   * Gets a mentionable option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(User|GuildMember|Role)} The value of the option, or null if not set and not required.
   */
  getMentionable(name, required = false) {
    const option = this._getTypedOption(name, ['MENTIONABLE'], ['user', 'member', 'role'], required);
    return option?.member ?? option?.user ?? option?.role ?? null;
  }
}

module.exports = CommandInteractionOptionResolver;
