'use strict';

const { ApplicationCommandOptionType } = require('discord-api-types/v10');
const InteractionOptionResolver = require('./InteractionOptionResolver');
const { ErrorCodes } = require('../errors');

/**
 * A resolver for autocomplete interaction options.
 * @extends {InteractionOptionResolver}
 */
class AutocompleteInteractionOptionResolver extends InteractionOptionResolver {
  /**
   * Gets the selected subcommand.
   * @param {boolean} [required=true] Whether to throw an error if there is no subcommand.
   * @returns {?string} The name of the selected subcommand, or null if not set and not required.
   */
  getSubcommand(required = true) {
    if (required && !this._subcommand) {
      throw new TypeError(ErrorCodes.CommandInteractionOptionNoSubcommand);
    }
    return this._subcommand;
  }

  /**
   * Gets the selected subcommand group.
   * @param {boolean} [required=false] Whether to throw an error if there is no subcommand group.
   * @returns {?string} The name of the selected subcommand group, or null if not set and not required.
   */
  getSubcommandGroup(required = false) {
    if (required && !this._group) {
      throw new TypeError(ErrorCodes.CommandInteractionOptionNoSubcommandGroup);
    }
    return this._group;
  }

  /**
   * Gets a boolean option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?boolean} The value of the option, or null if not set and not required.
   */
  getBoolean(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.Boolean, ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a string option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?string} The value of the option, or null if not set and not required.
   */
  getString(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.String, ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets an integer option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getInteger(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.Integer, ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a number option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getNumber(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.Number, ['value'], required);
    return option?.value ?? null;
  }

  /**
   * The full autocomplete option object.
   * @typedef {Object} AutocompleteFocusedOption
   * @property {string} name The name of the option
   * @property {ApplicationCommandOptionType} type The type of the application command option
   * @property {string} value The value of the option
   * @property {boolean} focused Whether this option is currently in focus for autocomplete
   */

  /**
   * Gets the focused option.
   * @param {boolean} [getFull=false] Whether to get the full option object
   * @returns {string|AutocompleteFocusedOption}
   * The value of the option, or the whole option if getFull is true
   */
  getFocused(getFull = false) {
    const focusedOption = this._hoistedOptions.find(option => option.focused);
    if (!focusedOption) throw new TypeError(ErrorCodes.AutocompleteInteractionOptionNoFocusedOption);
    return getFull ? focusedOption : focusedOption.value;
  }
}

module.exports = AutocompleteInteractionOptionResolver;
