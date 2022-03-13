'use strict';

const { SelectMenuBuilder: BuildersSelectMenuComponent, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class SelectMenuBuilder extends BuildersSelectMenuComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }

  /**
   * Creates a new select menu builder from json data
   * @param {JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent} other The other data
   * @returns {SelectMenuBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = SelectMenuBuilder;
