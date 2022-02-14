'use strict';

const { ActionRow: BuildersActionRow } = require('@discordjs/builders');
const snakecase = require('snakecase-keys');

class ActionRow extends BuildersActionRow {
  constructor(data = {}) {
    super(snakecase(data));
  }
}

module.exports = ActionRow;
