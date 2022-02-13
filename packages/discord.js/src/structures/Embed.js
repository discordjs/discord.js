'use strict';

const { Embed: BuildersEmbed } = require('@discordjs/builders');
const Embeds = require('../util/Embeds');

class Embed extends BuildersEmbed {
  constructor(data) {
    super({ ...Embeds.transformJSON(data) });
  }
}

module.exports = Embed;
