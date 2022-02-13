'use strict';

const { ActionRow: BuildersActionRow } = require('@discordjs/builders');
const Components = require('../util/Components');

class ActionRow extends BuildersActionRow {
  constructor(data) {
    // TODO: Simplify when getters PR is merged.
    const initData = Components.transformJSON(data);
    super({ ...initData, components: initData.components ?? [] });
  }
}

module.exports = ActionRow;
