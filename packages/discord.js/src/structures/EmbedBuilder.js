'use strict';

const { EmbedBuilder: BuildersEmbed, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

/**
 * Class used to build embed structures to be sent through the API
 * @extends {BuildersEmbed}
 */
class EmbedBuilder extends BuildersEmbed {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }

  /**
   * Sets the color of this embed
   * @param {?ColorResolvable} color The color of the embed
   * @returns {EmbedBuilder}
   */
  setColor(color) {
    return super.setColor(color && Util.resolveColor(color));
  }

  /**
   * Creates a new embed builder from json data
   * @param {JSONEncodable<APIEmbed> | APIEmbed} other The other data
   * @returns {EmbedBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = EmbedBuilder;
