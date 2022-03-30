'use strict';

const { TextInputBuilder: BuildersTextInputComponent, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class TextInputBuilder extends BuildersTextInputComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }

  /**
   * Creates a new text input builder from json data
   * @param {JSONEncodable<APITextInputComponent> | APITextInputComponent} other The other data
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
