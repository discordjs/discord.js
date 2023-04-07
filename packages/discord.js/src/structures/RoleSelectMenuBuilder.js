'use strict';

const { RoleSelectMenuBuilder: BuildersRoleSelectMenu, isJSONEncodable } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');

/**
 * Class used to build select menu components to be sent through the API
 * @extends {BuildersRoleSelectMenu}
 */
class RoleSelectMenuBuilder extends BuildersRoleSelectMenu {
  constructor(data = {}) {
    super(toSnakeCase(data));
  }

  /**
   * Creates a new select menu builder from json data
   * @param {JSONEncodable<APISelectMenuComponent> | APISelectMenuComponent} other The other data
   * @returns {RoleSelectMenuBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = RoleSelectMenuBuilder;

/**
 * @external BuildersRoleSelectMenu
 * @see {@link https://discord.js.org/docs/packages/builders/stable/RoleSelectMenuBuilder:Class}
 */
