'use strict';

const { Embed: BuildersEmbed } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class Embed extends BuildersEmbed {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = Embed;
