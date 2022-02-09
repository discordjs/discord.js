'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const { RangeError } = require('../errors');
const { InputTextStyles, MessageComponentTypes } = require('../util/Constants');
const Util = require('../util/Util');

/**
 * Represents an input text component in a modal
 * @extends {BaseMessageComponent}
 */

class InputTextComponent extends BaseMessageComponent {
  /**
   * @typedef {BaseMessageComponentOptions} InputTextComponentOptions
   * @property {string} [customId] A unique string to be sent in the interaction when submitted
   * @property {string} [label] The text to be displayed above this input text component
   * @property {number} [maxLength] Maximum length of text that can be entered
   * @property {number} [minLength] Minimum length of text required to be entered
   * @property {string} [placeholder] Custom placeholder text to display when no text is entered
   * @property {boolean} [required] Whether or not this input text component is required
   * @property {InputTextStyleResolvable} [style] The style of this input text component
   * @property {string} [value] Value of this input text component
   */

  /**
   * @param {InputTextComponent|InputTextComponentOptions} [data={}] InputTextComponent to clone or raw data
   */
  constructor(data = {}) {
    super({ type: 'INPUT_TEXT' });

    this.setup(data);
  }

  setup(data) {
    /**
     * A unique string to be sent in the interaction when submitted
     * @type {?string}
     */
    this.customId = data.custom_id ?? data.customId ?? null;

    /**
     * The text to be displayed above this input text component
     * @type {?string}
     */
    this.label = data.label ?? null;

    /**
     * Maximum length of text that can be entered
     * @type {?number}
     */
    this.maxLength = data.max_length ?? data.maxLength ?? null;

    /**
     * Minimum length of text required to be entered
     * @type {?string}
     */
    this.minLength = data.min_length ?? data.minLength ?? null;

    /**
     * Custom placeholder text to display when no text is entered
     * @type {?string}
     */
    this.placeholder = data.placeholder ?? null;

    /**
     * Whether or not this input text component is required
     * @type {?boolean}
     */
    this.required = data.required ?? false;

    /**
     * The style of this input text component
     * @type {?InputTextStyle}
     */
    this.style = data.style ? InputTextComponent.resolveStyle(data.style) : null;

    /**
     * Value of this input text component
     * @type {?string}
     */
    this.value = data.value ?? null;
  }

  /**
   * Sets the custom id of this input text component
   * @param {string} customId A unique string to be sent in the interaction when submitted
   * @returns {InputTextComponent}
   */
  setCustomId(customId) {
    this.customId = Util.verifyString(customId, RangeError, 'INPUT_TEXT_CUSTOM_ID');
    return this;
  }

  /**
   * Sets the label of this input text component
   * @param {string} label The text to be displayed above this input text component
   * @returns {InputTextComponent}
   */
  setLabel(label) {
    this.label = Util.verifyString(label, RangeError, 'INPUT_TEXT_LABEL');
    return this;
  }

  /**
   * Sets the input text component to be required for modal submission
   * @param {boolean} [required=true] Whether this input text component is required
   * @returns {InputTextComponent}
   */
  setRequired(required = true) {
    this.required = required;
    return this;
  }

  /**
   * Sets the maximum length of text input required in this input text component
   * @param {number} maxLength Maximum length of text to be required
   * @returns {InputTextComponent}
   */
  setMaxLength(maxLength) {
    this.maxLength = maxLength;
    return this;
  }

  /**
   * Sets the minimum length of text input required in this input text component
   * @param {number} minLength Minimum length of text to be required
   * @returns {InputTextComponent}
   */
  setMinLength(minLength) {
    this.minLength = minLength;
    return this;
  }

  /**
   * Sets the placeholder of this input text component
   * @param {string} placeholder Custom placeholder text to display when no text is entered
   * @returns {InputTextComponent}
   */
  setPlaceholder(placeholder) {
    this.placeholder = Util.verifyString(placeholder, RangeError, 'INPUT_TEXT_PLACEHOLDER');
    return this;
  }

  /**
   * Sets the style of this input text component
   * @param {InputTextStyleResolvable} style The style of this input text component
   * @returns {InputTextComponent}
   */
  setStyle(style) {
    this.style = InputTextComponent.resolveStyle(style);
    return this;
  }

  /**
   * Sets the value of this input text component
   * @param {string} value Value of this input text component
   * @returns {InputTextComponent}
   */
  setValue(value) {
    this.value = Util.verifyString(value, RangeError, 'INPUT_TEXT_VALUE');
    return this;
  }

  /**
   * Transforms the input text component into a plain object
   * @returns {APIInputText} The raw data of this input text component
   */
  toJSON() {
    return {
      custom_id: this.customId,
      label: this.label,
      max_length: this.maxLength,
      min_length: this.minLength,
      placeholder: this.placeholder,
      required: this.required,
      style: InputTextStyles[this.style],
      type: MessageComponentTypes[this.type],
      value: this.value,
    };
  }

  /**
   * Data that can be resolved to an InputTextStyle. This can be
   * * InputTextStyle
   * * number
   * @typedef {number|InputTextStyle} InputTextStyleResolvable
   */

  /**
   * Resolves the style of an input tetx component
   * @param {InputTextStyleResolvable} style The style to resolve
   * @returns {InputTextStyle}
   * @private
   */
  static resolveStyle(style) {
    return typeof style === 'string' ? style : InputTextStyles[style];
  }
}

module.exports = InputTextComponent;
