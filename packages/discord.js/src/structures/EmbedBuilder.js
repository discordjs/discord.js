'use strict';

const { EmbedBuilder: BuildersEmbed, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

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
}

module.exports = EmbedBuilder;
