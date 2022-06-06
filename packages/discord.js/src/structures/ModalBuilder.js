'use strict';

const { ModalBuilder: BuildersModal, ComponentBuilder, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

/**
 * Represents a modal builder.
 * @extends {BuildersModal}
 */
class ModalBuilder extends BuildersModal {
  constructor({ components, ...data } = {}) {
    super({
      ...Transformers.toSnakeCase(data),
      components: components?.map(c => (c instanceof ComponentBuilder ? c : Transformers.toSnakeCase(c))),
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
 * @see {@link https://discord.js.org/#/docs/builders/main/class/ModalBuilder}
 */
