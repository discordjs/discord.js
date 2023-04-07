'use strict';

const { ModalBuilder: BuildersModal, ComponentBuilder, isJSONEncodable } = require('@discordjs/builders');
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
   * @param {JSONEncodable<APIModalComponent>|APIModalComponent} other The other data
   * @returns {ModalBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = ModalBuilder;

/**
 * @external BuildersModal
 * @see {@link https://discord.js.org/docs/packages/builders/stable/ModalBuilder:Class}
 */
