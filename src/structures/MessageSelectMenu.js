'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');

class MessageSelectMenu extends BaseMessageComponent {
  /**
   * @typedef {BaseMessageComponentOptions} MessageSelectMenuOptions
   * @property {?string} [customID] A unique string to be sent in the interaction when clicked
   * @property {?string} [placeholder] Custom placeholder text to display when nothing is selected
   * @property {?number} [minValues] The minimum number of selections required
   * @property {?number} [maxValues] The maximum number of selections allowed
   * @property {?MessageSelectOption[]} [options] Options for the select menu
   */

  /**
   * @typedef {Object} MessageSelectOption
   * @property {string} label The text to be displayed on this option
   * @property {string} value The value to be sent for this option
   * @property {?string} [description] Optional description to show for this option
   * @property {?Emoji} [emoji] Emoji to display for this option
   * @property {boolean} [default] Render this option as the default selection
   */

  /**
   * @param {MessageSelectMenu|MessageSelectMenuOptions} [data={}] MessageSelectMenu to clone or raw data
   */
  constructor(data = {}) {
    super({ type: 'SELECT_MENU' });

    this.setup(data);
  }

  super(data) {
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
}

module.exports = MessageSelectMenu;
