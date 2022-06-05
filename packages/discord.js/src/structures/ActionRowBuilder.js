'use strict';

const { ActionRowBuilder: BuildersActionRow, ComponentBuilder, isJSONEncodable } = require('@discordjs/builders');
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

  /**
   * Creates a new action row builder from JSON data
   * @param {JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>
   * |APIActionRowComponent<APIActionRowComponentTypes>} other The other data
   * @returns {ActionRowBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = ActionRowBuilder;

/**
 * @external BuildersActionRow
 * @see {@link https://discord.js.org/#/docs/builders/main/class/ActionRowBuilder}
 */
