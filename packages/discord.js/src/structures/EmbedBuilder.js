'use strict';

const { EmbedBuilder: BuildersEmbed, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

class EmbedBuilder extends BuildersEmbed {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
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

  /**
   * Sets the color of this embed
   * @param {?ColorResolvable} color The color of the embed
   * @returns {Embed}
   */
  setColor(color) {
    if (color === null) {
      return super.setColor(null);
    }
    return super.setColor(Util.resolveColor(color));
  }
}

module.exports = EmbedBuilder;
