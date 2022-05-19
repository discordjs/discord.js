'use strict';

const { ActionRowBuilder: BuildersActionRow, ComponentBuilder } = require('@discordjs/builders');
const Components = require('../util/Components');
const Transformers = require('../util/Transformers');

/**
 * Represents an action row builder.
 * @extends {BuildersActionRow}
 */
class ActionRowBuilder extends BuildersActionRow {
  constructor({ components, ...data } = {}) {
    super({
      ...Transformers.toSnakeCase(data),
      components: components?.map(c => (c instanceof ComponentBuilder ? c : Components.createComponentBuilder(c))),
    });
  }
}

module.exports = ActionRowBuilder;

/**
 * @external BuildersActionRow
 * @see {@link https://discord.js.org/#/docs/builders/main/class/ActionRowBuilder}
 */
