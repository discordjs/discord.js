'use strict';

const { ActionRowBuilder: BuildersActionRow } = require('@discordjs/builders');
const { isJSONEncodable } = require('@discordjs/util');
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
      components: components?.map(c => createComponentBuilder(c)),
    });
  }

  /**
   * Creates a new action row builder from JSON data
   * @param {ActionRow|ActionRowBuilder|APIActionRowComponent} other The other data
   * @returns {ActionRowBuilder}
   */
  static from(other) {
    return new this(isJSONEncodable(other) ? other.toJSON() : other);
  }
}

module.exports = ActionRowBuilder;

/**
 * @external BuildersActionRow
 * @see {@link https://discord.js.org/docs/packages/builders/stable/ActionRowBuilder:Class}
 */
