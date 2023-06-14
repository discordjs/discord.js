'use strict';

const { RoleSelectMenuBuilder: BuildersRoleSelectMenu } = require('@discordjs/builders');
const { isJSONEncodable } = require('@discordjs/util');
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
   * Creates a new select menu builder from JSON data
   * @param {RoleSelectMenuBuilder|RoleSelectMenuComponent|APIRoleSelectComponent} other The other data
   * @returns {RoleSelectMenuBuilder}
   */
  static from(other) {
    return new this(isJSONEncodable(other) ? other.toJSON() : other);
  }
}

module.exports = RoleSelectMenuBuilder;

/**
 * @external BuildersRoleSelectMenu
 * @see {@link https://discord.js.org/docs/packages/builders/stable/RoleSelectMenuBuilder:Class}
 */
