'use strict';

const { ActionRowBuilder: BuildersActionRow, ComponentBuilder } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

/**
 * Class used to build action row components to be sent through the API
 * @extends {BuildersActionRow}
 */
class ActionRowBuilder extends BuildersActionRow {
  constructor({ components, ...data } = {}) {
    super({
      components: components?.map(c => (c instanceof ComponentBuilder ? c : Transformers.toSnakeCase(c))),
      ...Transformers.toSnakeCase(data),
    });
  }
}

module.exports = ActionRowBuilder;
