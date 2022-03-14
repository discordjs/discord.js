'use strict';

const { ButtonBuilder: BuildersButtonComponent, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class ButtonBuilder extends BuildersButtonComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }

  /**
   * Creates a new button builder from json data
   * @param {JSONEncodable<APIButtonComponent> | APIButtonComponent} other The other data
   * @returns {ButtonBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = ButtonBuilder;
