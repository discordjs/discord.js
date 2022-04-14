'use strict';

const { SelectMenuBuilder: BuildersSelectMenu, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

/**
 * Represents a select menu builder.
 * @extends {BuildersSelectMenu}
 */
class SelectMenuBuilder extends BuildersSelectMenu {
  constructor({ options, ...data }) {
    super(
      Transformers.toSnakeCase({
        options: options.map(({ emoji, ...option }) => ({
          ...option,
          emoji: emoji && typeof emoji === 'string' ? Util.parseEmoji(emoji) : emoji,
        })),
        ...data,
      }),
    );
  }

  /**
   * Creates a new select menu builder from JSON data
   * @param {JSONEncodable<APISelectMenuComponent>|APISelectMenuComponent} other The other data
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

/**
 * @external BuildersSelectMenu
 * @see {@link https://discord.js.org/#/docs/builders/main/class/SelectMenuBuilder}
 */
