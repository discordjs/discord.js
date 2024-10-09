'use strict';

const { ActionRowBuilder: BuildersActionRow } = require('@discordjs/builders');
const { createComponentBuilder } = require('../util/Components');
const { toSnakeCase } = require('../util/Transformers');

/**
 * Represents an action row builder.
 * @extends {BuildersActionRow}
 */
class ActionRowBuilder extends BuildersActionRow {
  constructor({ components, ...data } = {}) {
    super({
      ...toSnakeCase(data),
      components: components?.map(component => createComponentBuilder(component)),
    });
  }
}

module.exports = ActionRowBuilder;

/**
 * @external BuildersActionRow
 * @see {@link https://discord.js.org/docs/packages/builders/stable/ActionRowBuilder:Class}
 */
