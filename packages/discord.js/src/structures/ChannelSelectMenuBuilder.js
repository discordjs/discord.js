'use strict';

const { ChannelSelectMenuBuilder: BuildersChannelSelectMenu, isJSONEncodable } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');

/**
 * Class used to build select menu components to be sent through the API
 * @extends {BuildersChannelSelectMenu}
 */
class ChannelSelectMenuBuilder extends BuildersChannelSelectMenu {
  constructor(data = {}) {
    super(toSnakeCase(data));
  }

  /**
   * Creates a new select menu builder from json data
   * @param {JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent} other The other data
   * @returns {ChannelSelectMenuBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = ChannelSelectMenuBuilder;

/**
 * @external BuildersChannelSelectMenu
 * @see {@link https://discord.js.org/docs/packages/builders/stable/ChannelSelectMenuBuilder:Class}
 */
