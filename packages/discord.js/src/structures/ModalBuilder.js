'use strict';

const { ModalBuilder: BuildersModal, ComponentBuilder } = require('@discordjs/builders');
const { isJSONEncodable } = require('@discordjs/util');
const { toSnakeCase } = require('../util/Transformers');

/**
 * Represents a modal builder.
 * @extends {BuildersModal}
 */
class ModalBuilder extends BuildersModal {
  constructor({ components, ...data } = {}) {
    super({
      ...toSnakeCase(data),
      components: components?.map(c => (c instanceof ComponentBuilder ? c : toSnakeCase(c))),
    });
  }

  /**
   * Creates a new modal builder from JSON data
   * @param {ModalBuilder|APIModalComponent} other The other data
   * @returns {ModalBuilder}
   */
  static from(other) {
    return new this(isJSONEncodable(other) ? other.toJSON() : other);
  }
}

module.exports = ModalBuilder;

/**
 * @external BuildersModal
 * @see {@link https://discord.js.org/docs/packages/builders/stable/ModalBuilder:Class}
 */
