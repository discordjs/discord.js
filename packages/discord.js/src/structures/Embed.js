'use strict';

const { Embed: BuildersEmbed } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const { Util } = require('../util/Util');

class Embed extends BuildersEmbed {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }

  setColor(color) {
    if (color === null) {
      return super.setColor(null);
    }
    return super.setColor(Util.resolveColor(color));
  }
}

module.exports = Embed;
