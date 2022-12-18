'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const { MessageComponentTypes, SelectMenuComponentTypes, ChannelTypes } = require('../util/Constants');
const Util = require('../util/Util');

/**
 * Represents a select menu message component
 * @extends {BaseMessageComponent}
 */
class MessageSelectMenu extends BaseMessageComponent {
  /**
   * @typedef {BaseMessageComponentOptions} MessageSelectMenuOptions
   * @property {string} [customId] A unique string to be sent in the interaction when clicked
   * @property {string} [placeholder] Custom placeholder text to display when nothing is selected
   * @property {number} [minValues] The minimum number of selections required
   * @property {number} [maxValues] The maximum number of selections allowed
   * @property {MessageSelectOption[]} [options] Options for the select menu
   * @property {boolean} [disabled=false] Disables the select menu to prevent interactions
   */

  /**
   * @typedef {Object} MessageSelectOption
   * @property {string} label The text to be displayed on this option
   * @property {string} value The value to be sent for this option
   * @property {?string} description Optional description to show for this option
   * @property {?RawEmoji} emoji Emoji to display for this option
   * @property {boolean} default Render this option as the default selection
   */

  /**
   * @typedef {Object} MessageSelectOptionData
   * @property {string} label The text to be displayed on this option
   * @property {string} value The value to be sent for this option
   * @property {string} [description] Optional description to show for this option
   * @property {EmojiIdentifierResolvable} [emoji] Emoji to display for this option
   * @property {boolean} [default] Render this option as the default selection
   */

  /**
   * @param {MessageSelectMenu|MessageSelectMenuOptions} [data={}] MessageSelectMenu to clone or raw data
   */
  constructor(data = {}) {
    super({ type: BaseMessageComponent.resolveType(data.type) ?? 'STRING_SELECT' });
    this.setup(data);
  }

  setup(data) {
    /**
     * A unique string to be sent in the interaction when clicked
     * @type {?string}
     */
    this.customId = data.custom_id ?? data.customId ?? null;

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
     * Options for the STRING_SELECT menu
     * @type {MessageSelectOption[]}
     */
    this.options = this.constructor.normalizeOptions(data.options ?? []);

    /**
     * Whether this select menu is currently disabled
     * @type {boolean}
     */
    this.disabled = data.disabled ?? false;
    /**
     * Channels that are possible to select in CHANNEL_SELECT menu
     * @type {ChannelType[]}
     */
    this.channelTypes =
      data.channel_types?.map(channelType =>
        typeof channelType === 'string' ? channelType : ChannelTypes[channelType],
      ) ?? [];
  }

  /**
   * Sets the custom id of this select menu
   * @param {string} customId A unique string to be sent in the interaction when clicked
   * @returns {MessageSelectMenu}
   */
  setCustomId(customId) {
    this.customId = Util.verifyString(customId, RangeError, 'SELECT_MENU_CUSTOM_ID');
    return this;
  }

  /**
   * Sets the type of the select menu
   * @param {SelectMenuComponentType} type Type of the select menu
   * @returns {MessageSelectMenu}
   */
  setType(type) {
    if (!SelectMenuComponentTypes[type]) throw new TypeError('INVALID_TYPE', 'type', 'SelectMenuComponentType');
    this.type = BaseMessageComponent.resolveType(type);
    return this;
  }

  /**
   * Adds the channel type to the select menu
   * @param {...ChannelType[]} channelType Added channel type
   * @returns {MessageSelectMenu}
   */
  addChannelTypes(...channelTypes) {
    if (!channelTypes.every(channelType => ChannelTypes[channelType])) {
      throw new TypeError('INVALID_TYPE', 'channelTypes', 'Rest<ChannelTypes[]>');
    }
    this.channelTypes.push(
      ...channelTypes.map(channelType => (typeof channelType === 'string' ? channelType : ChannelTypes[channelType])),
    );
    return this;
  }

  /**
   * Sets the channel types of the select menu
   * @param {ChannelType[]} channelTypes An array of new channel types
   * @returns {MessageSelectMenu}
   */
  setChannelTypes(...channelTypes) {
    if (!channelTypes.every(channelType => ChannelTypes[channelType])) {
      throw new TypeError('INVALID_TYPE', 'channelTypes', 'Array<ChannelType>');
    }
    this.channelTypes = channelTypes.map(channelType =>
      typeof channelType === 'string' ? channelType : ChannelTypes[channelType],
    );
    return this;
  }

  /**
   * Sets the interactive status of the select menu
   * @param {boolean} [disabled=true] Whether this select menu should be disabled
   * @returns {MessageSelectMenu}
   */
  setDisabled(disabled = true) {
    this.disabled = disabled;
    return this;
  }

  /**
   * Sets the maximum number of selections allowed for this select menu
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
    this.placeholder = Util.verifyString(placeholder, RangeError, 'SELECT_MENU_PLACEHOLDER');
    return this;
  }

  /**
   * Adds options to the select menu.
   * @param {...MessageSelectOptionData|MessageSelectOptionData[]} options The options to add
   * @returns {MessageSelectMenu}
   */
  addOptions(...options) {
    this.options.push(...this.constructor.normalizeOptions(options));
    return this;
  }

  /**
   * Sets the options of the select menu.
   * @param {...MessageSelectOptionData|MessageSelectOptionData[]} options The options to set
   * @returns {MessageSelectMenu}
   */
  setOptions(...options) {
    this.spliceOptions(0, this.options.length, options);
    return this;
  }

  /**
   * Removes, replaces, and inserts options in the select menu.
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of options to remove
   * @param {...MessageSelectOptionData|MessageSelectOptionData[]} [options] The replacing option objects
   * @returns {MessageSelectMenu}
   */
  spliceOptions(index, deleteCount, ...options) {
    this.options.splice(index, deleteCount, ...this.constructor.normalizeOptions(...options));
    return this;
  }

  /**
   * Transforms the select menu into a plain object
   * @returns {APIMessageSelectMenu} The raw data of this select menu
   */
  toJSON() {
    return {
      custom_id: this.customId,
      disabled: this.disabled,
      placeholder: this.placeholder,
      min_values: this.minValues,
      max_values: this.maxValues ?? (this.minValues ? this.options.length : undefined),
      options: this.options,
      channel_types: this.channelTypes.map(type => (typeof type === 'string' ? ChannelTypes[type] : type)),
      type: typeof this.type === 'string' ? MessageComponentTypes[this.type] : this.type,
    };
  }

  /**
   * Normalizes option input and resolves strings and emojis.
   * @param {MessageSelectOptionData} option The select menu option to normalize
   * @returns {MessageSelectOption}
   */
  static normalizeOption(option) {
    let { label, value, description, emoji } = option;

    label = Util.verifyString(label, RangeError, 'SELECT_OPTION_LABEL');
    value = Util.verifyString(value, RangeError, 'SELECT_OPTION_VALUE');
    emoji = emoji ? Util.resolvePartialEmoji(emoji) : null;
    description = description ? Util.verifyString(description, RangeError, 'SELECT_OPTION_DESCRIPTION', true) : null;

    return { label, value, description, emoji, default: option.default ?? false };
  }

  /**
   * Normalizes option input and resolves strings and emojis.
   * @param {...MessageSelectOptionData|MessageSelectOptionData[]} options The select menu options to normalize
   * @returns {MessageSelectOption[]}
   */
  static normalizeOptions(...options) {
    return options.flat(Infinity).map(option => this.normalizeOption(option));
  }
}

module.exports = MessageSelectMenu;
