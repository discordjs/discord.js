'use strict';

const InteractionOptionResolver = require('./InteractionOptionResolver');
const { ErrorCodes } = require('../errors');

/**
 * A resolver for autocomplete interaction options.
 * @extends {InteractionOptionResolver}
 */
class AutocompleteInteractionOptionResolver extends InteractionOptionResolver {
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
