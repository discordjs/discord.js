'use strict';

const { EmbedBuilder: BuildersEmbed } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class EmbedBuilder extends BuildersEmbed {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = EmbedBuilder;
