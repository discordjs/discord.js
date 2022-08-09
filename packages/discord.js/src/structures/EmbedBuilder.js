'use strict';

const { EmbedBuilder: BuildersEmbed, isJSONEncodable } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');
const { resolveColor } = require('../util/Util');

/**
 * Represents an embed builder.
 * @extends {BuildersEmbed}
 */
class EmbedBuilder extends BuildersEmbed {
  constructor(data) {
    const snakeCased = toSnakeCase(data);
    if (data?.timestamp) snakeCased.timestamp = data.timestamp;
    super(snakeCased);
  }

  /**
   * Sets the color of this embed
   * @param {?ColorResolvable} color The color of the embed
   * @returns {EmbedBuilder}
   */
  setColor(color) {
    return super.setColor(color && resolveColor(color));
  }

  /**
   * Creates a new embed builder from JSON data
   * @param {JSONEncodable<APIEmbed>|APIEmbed} other The other data
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

/**
 * @external BuildersEmbed
 * @see {@link https://discord.js.org/#/docs/builders/main/class/EmbedBuilder}
 */
