'use strict';

const { TextInputBuilder: BuildersTextInput, isJSONEncodable } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');

/**
 * Represents a text input builder.
 * @extends {BuildersTextInput}
 */
class TextInputBuilder extends BuildersTextInput {
  constructor(data) {
    super(toSnakeCase(data));
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
}

module.exports = TextInputBuilder;

/**
 * @external BuildersTextInput
 * @see {@link https://discord.js.org/docs/packages/builders/main/TextInputBuilder:Class}
 */
