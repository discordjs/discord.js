'use strict';

const { TextInputBuilder: BuildersTextInput, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

/**
 * Class used to build Text Input components to be sent through the API
 * @extends {BuildersTextInput}
 */
class TextInputBuilder extends BuildersTextInput {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }

  /**
   * Creates a new text input builder from JSON data
   * @param {JSONEncodable<APITextInputComponent>|APITextInputComponent} other The other data
   * @returns {TextInputBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }

  /**
   * A unique string to be sent in the interaction when submitted
   * @type {?string}
   * @readonly
   */
  get customId() {
    return this.data.custom_id ?? null;
  }

  /**
   * The text to be displayed above this text input field
   * @type {?string}
   * @readonly
   */
  get label() {
    return this.data.label ?? null;
  }

  /**
   * The style of a text input component represented by a number. This can be:
   * * 1 - Short
   * * 2 - Paragraph
   * @typedef {number} TextInputStyle
   */

  /**
   * The style of this text input field
   * @type {?TextInputStyle}
   * @readonly
   */
  get style() {
    return this.data.style ?? null;
  }

  /**
   * The maximum length the input on this text input field can have
   * @type {?number}
   * @readonly
   */
  get maxLength() {
    return this.data.max_length ?? null;
  }

  /**
   * The minimum length the input on this text input field can have
   * @type {?number}
   * @readonly
   */
  get minLength() {
    return this.data.min_length ?? null;
  }

  /**
   * Whether it is required to fill in this text input field
   * @type {?boolean}
   * @readonly
   */
  get required() {
    return this.data.required ?? null;
  }

  /**
   * The initial value displayed in this text input field.
   * If not modified, this will be sent through the interaction, unlike the placeholder
   * @type {?string}
   * @readonly
   */
  get value() {
    return this.data.value ?? null;
  }

  /**
   * The text to be displayed on this text input field when no value has been set.
   * Will appear greyed out in the Discord UI
   * @type {?string}
   * @readonly
   */
  get placeholder() {
    return this.data.placeholder ?? null;
  }
}

module.exports = TextInputBuilder;

/**
 * @external BuildersTextInput
 * @see {@link https://discord.js.org/#/docs/builders/main/class/TextInputBuilder}
 */
