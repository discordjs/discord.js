'use strict';

const { ActionRow: BuildersActionRow, Component } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class ActionRow extends BuildersActionRow {
  constructor({ components, ...data } = {}) {
    super({
      components: components?.map(c => (c instanceof Component ? c : Transformers.toSnakeCase(c))),
      ...Transformers.toSnakeCase(data),
    });
  }
}

module.exports = ActionRow;
