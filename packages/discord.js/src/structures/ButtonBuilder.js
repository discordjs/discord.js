'use strict';

const { ButtonBuilder: BuildersButtonComponent, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

class ButtonBuilder extends BuildersButtonComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }

  /**
   * Sets the emoji to display on this button
   * @param {string|APIMessageComponentEmoji} emoji The emoji to display on this button
   * @returns {ButtonComponent}
   */
  setEmoji(emoji) {
    if (typeof emoji === 'string') {
      return super.setEmoji(Util.parseEmoji(emoji));
    }
    return super.setEmoji(emoji);
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
