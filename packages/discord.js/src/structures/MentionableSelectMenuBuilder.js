'use strict';

const { MentionableSelectMenuBuilder: BuildersMentionableSelectMenu, isJSONEncodable } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');

/**
 * Class used to build select menu components to be sent through the API
 * @extends {BuildersMentionableSelectMenu}
 */
class MentionableSelectMenuBuilder extends BuildersMentionableSelectMenu {
  constructor(data = {}) {
    super(toSnakeCase(data));
  }

  /**
   * Creates a new select menu builder from JSON data
   * @param {MentionableSelectMenuBuilder|MentionableSelectMenuComponent|APIMentionableSelectComponent} other
   * The other data
   * @returns {MentionableSelectMenuBuilder}
   */
  static from(other) {
    return new this(isJSONEncodable(other) ? other.toJSON() : other);
  }
}

module.exports = MentionableSelectMenuBuilder;

/**
 * @external BuildersMentionableSelectMenu
 * @see {@link https://discord.js.org/docs/packages/builders/main/MentionableSelectMenuBuilder:Class}
 */
