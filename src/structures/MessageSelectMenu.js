'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const { MessageComponentTypes } = require('../util/Constants');
const Util = require('../util/Util');

/**
 * Represents a SelectMenu message components
 * @extends {BaseMessageComponent}
 */
class MessageSelectMenu extends BaseMessageComponent {
  /**
   * @typedef {BaseMessageComponentOptions} MessageSelectMenuOptions
   * @property {string} [customID] A unique string to be sent in the interaction when clicked
   * @property {string} [placeholder] Custom placeholder text to display when nothing is selected
   * @property {number} [minValues] The minimum number of selections required
   * @property {number} [maxValues] The maximum number of selections allowed
   * @property {MessageSelectOption[]} [options] Options for the select menu
   */

  /**
   * @typedef {Object} MessageSelectOption
   * @property {string} label The text to be displayed on this option
   * @property {string} value The value to be sent for this option
   * @property {string} [description] Optional description to show for this option
   * @property {Emoji} [emoji] Emoji to display for this option
   * @property {boolean} [default] Render this option as the default selection
   */

  /**
   * @param {MessageSelectMenu|MessageSelectMenuOptions} [data={}] MessageSelectMenu to clone or raw data
   */
  constructor(data = {}) {
    super({ type: 'SELECT_MENU' });

    this.setup(data);
  }

  setup(data) {
    /**
     * A unique string to be sent in the interaction when clicked
     * @type {?string}
     */
    this.customID = data.custom_id ?? data.customID ?? null;

    /**
     * Custom placeholder text to display when nothing is selected
     * @type {?string}
     */
    this.placeholder = data.placeholder ?? null;

    /**
     * The minimum number of selections required
     * @type {?number}
     */
    this.minValues = data.min_values ?? data.minValues ?? null;

    /**
     * The maximum number of selections allowed
     * @type {?number}
     */
    this.maxValues = data.max_values ?? data.maxValues ?? null;

    /**
     * Options for the select menu
     * @type {MessageSelectOption[]}
     */
    this.options = data.options ?? [];
  }

  /**
   * Sets the custom ID of this select menu
   * @param {string} customID A unique string to be sent in the interaction when clicked
   * @returns {MessageSelectMenu}
   */
  setCustomID(customID) {
    this.customID = Util.resolveString(customID);
    return this;
  }

  /**
   * Sets the maximum number of selection allowed for this select menu
   * @param {number} maxValues Number of selections to be allowed
   * @returns {MessageSelectMenu}
   */
  setMaxValues(maxValues) {
    this.maxValues = maxValues;
    return this;
  }

  /**
   * Sets the minimum number of selections required for this select menu
   * <info>This will default the maxValues to the number of options, unless manually set</info>
   * @param {number} minValues Number of selections to be required
   * @returns {MessageSelectMenu}
   */
  setMinValues(minValues) {
    this.minValues = minValues;
    return this;
  }

  /**
   * Sets the placeholder of this select menu
   * @param {string} placeholder Custom placeholder text to display when nothing is selected
   * @returns {MessageSelectMenu}
   */
  setPlaceholder(placeholder) {
    this.placeholder = Util.resolveString(placeholder);
    return this;
  }

  /**
   * Adds options to the select menu.
   * @param {...(MessageSelectOption[]|MessageSelectOption[])} options The options to add
   * @returns {MessageSelectMenu}
   */
  addOptions(...options) {
    this.options.push(...this.constructor.normalizeOptions(options));
    return this;
  }

  /**
   * Removes, replaces, and inserts options in the select menu.
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of options to remove
   * @param {...MessageSelectOption|MessageSelectOption[]} [options] The replacing option objects
   * @returns {MessageSelectMenu}
   */
  spliceOptions(index, deleteCount, ...options) {
    this.options.splice(index, deleteCount, ...this.constructor.normalizeOptions(...options));
    return this;
  }

  /**
   * Transforms this select menu to a plain object
   * @returns {Object} The raw data of this select menu
   */
  toJSON() {
    return {
      custom_id: this.customID,
      placeholder: this.placeholder,
      min_values: this.minValues,
      max_values: this.maxValues ?? this.minValues ? this.options.length : undefined,
      options: this.options,
      type: typeof this.type === 'string' ? MessageComponentTypes[this.type] : this.type,
    };
  }

  /**
   * Normalizes option input and resolves strings.
   * @param {MessageSelectOption} option The select menu option to normalize
   * @returns {MessageSelectOption}
   */
  static normalizeOption(option) {
    let { label, value, description, emoji } = option;

    label = Util.resolveString(label);
    value = Util.resolveString(value);
    emoji = /^\d{17,19}$/.test(emoji) ? { id: emoji } : Util.parseEmoji(emoji);
    description = typeof description !== 'undefined' ? Util.resolveString(description) : undefined;

    return { label, value, description, emoji, default: option.default };
  }

  /**
   * Normalizes option input and resolves strings and emojis.
   * @param {...MessageSelectOption|MessageSelectOption[]} options The select menu options to normalize
   * @returns {MessageSelectOption[]}
   */
  static normalizeOptions(...options) {
    return options.flat(2).map(option => this.normalizeOption(option));
  }
}

module.exports = MessageSelectMenu;
