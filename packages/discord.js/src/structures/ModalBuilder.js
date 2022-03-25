'use strict';

const { ModalBuilder: BuildersModal, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

/**
 * Represents a modal builder.
 */
class ModalBuilder extends BuildersModal {
  constructor({ components, ...data }) {
    super({
      components: components?.map(c => (isJSONEncodable(c) ? c.toJSON() : Transformers.toSnakeCase(c))),
      ...Transformers.toSnakeCase(data),
    });
  }
  /**
   * Creates a new modal builder from JSON data
   * @param {JSONEncodable<APIModalComponent> | APIModalComponent} other The other data
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
