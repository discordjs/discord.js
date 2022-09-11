'use strict';

const { TypeError, ErrorCodes } = require('../errors');

/**
 * A resolver for interaction options.
 */
class InteractionOptionResolver {
  constructor(client, options, resolved) {
    /**
     * The client that instantiated this.
     * @name CommandInteractionOptionResolver#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The bottom-level options for the interaction.
     * If there is a subcommand (or subcommand and group), this is the options for the subcommand.
     * @type {CommandInteractionOption[]}
     * @private
     */
    this._hoistedOptions = options;

    /**
     * The interaction options array.
     * @name CommandInteractionOptionResolver#data
     * @type {ReadonlyArray<CommandInteractionOption>}
     * @readonly
     */
    Object.defineProperty(this, 'data', { value: Object.freeze([...options]) });

    /**
     * The interaction resolved data
     * @name CommandInteractionOptionResolver#resolved
     * @type {?Readonly<CommandInteractionResolvedData>}
     */
    Object.defineProperty(this, 'resolved', { value: resolved ? Object.freeze(resolved) : null });
  }

  /**
   * Gets an option by its name.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?CommandInteractionOption} The option, if found.
   */
  get(name, required = false) {
    const option = this._hoistedOptions.find(opt => opt.name === name);
    if (!option) {
      if (required) {
        throw new TypeError(ErrorCodes.CommandInteractionOptionNotFound, name);
      }
      return null;
    }
    return option;
  }

  /**
   * Gets an option by name and property and checks its type.
   * @param {string} name The name of the option.
   * @param {ApplicationCommandOptionType} type The type of the option.
   * @param {string[]} properties The properties to check for for `required`.
   * @param {boolean} required Whether to throw an error if the option is not found.
   * @returns {?CommandInteractionOption} The option, if found.
   * @private
   */
  _getTypedOption(name, type, properties, required) {
    const option = this.get(name, required);
    if (!option) {
      return null;
    } else if (option.type !== type) {
      throw new TypeError(ErrorCodes.CommandInteractionOptionType, name, option.type, type);
    } else if (required && properties.every(prop => option[prop] === null || typeof option[prop] === 'undefined')) {
      throw new TypeError(ErrorCodes.CommandInteractionOptionEmpty, name, option.type);
    }
    return option;
  }
}

module.exports = InteractionOptionResolver;
