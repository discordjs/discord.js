'use strict';

const { UserSelectMenuBuilder: BuildersUserSelectMenu, isJSONEncodable } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');

/**
 * Class used to build select menu components to be sent through the API
 * @extends {BuildersUserSelectMenu}
 */
class UserSelectMenuBuilder extends BuildersUserSelectMenu {
  constructor(data = {}) {
    super(toSnakeCase(data));
  }

  /**
   * Creates a new select menu builder from JSON data
   * @param {UserSelectMenuBuilder|UserSelectMenuComponent|APIUserSelectComponent} other The other data
   * @returns {UserSelectMenuBuilder}
   */
  static from(other) {
    return new this(isJSONEncodable(other) ? other.toJSON() : other);
  }
}

module.exports = UserSelectMenuBuilder;

/**
 * @external BuildersUserSelectMenu
 * @see {@link https://discord.js.org/docs/packages/rest/stable/UserSelectMenuBuilder:Class}
 */
