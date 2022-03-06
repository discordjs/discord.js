'use strict';

const { Embed: BuildersEmbed } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const { Util } = require('../util/Util');

/**
 * Represents an embed object
 */
class Embed extends BuildersEmbed {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }

  /**
   * Sets the color of this embed
   * @param {ColorResolvable} color The color of the embed
   * @returns {Embed}
   */
  setColor(color) {
    if (color === null) {
      return super.setColor(null);
    }
    return super.setColor(Util.resolveColor(color));
  }
}

module.exports = Embed;
