'use strict';

const { ActionRow: BuildersActionRow } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class ActionRow extends BuildersActionRow {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = ActionRow;
