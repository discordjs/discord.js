'use strict';

const { SelectMenuBuilder: BuildersSelectMenu, isJSONEncodable, normalizeArray } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');
const { resolvePartialEmoji } = require('../util/Util');

/**
 * Class used to build select menu components to be sent through the API
 * @extends {BuildersSelectMenu}
 */
class SelectMenuBuilder extends BuildersSelectMenu {
  constructor({ options, ...data } = {}) {
    super(
      toSnakeCase({
        ...data,
        options: options?.map(({ emoji, ...option }) => ({
          ...option,
          emoji: emoji && typeof emoji === 'string' ? resolvePartialEmoji(emoji) : emoji,
        })),
      }),
    );
  }

  /**
   * Normalizes a select menu option emoji
   * @param {SelectMenuOptionData|JSONEncodable<APISelectMenuOption>} selectMenuOption The option to normalize
   * @returns {Array<SelectMenuOptionBuilder|APISelectMenuOption>}
   * @private
   */
  static normalizeEmoji(selectMenuOption) {
    if (isJSONEncodable(selectMenuOption)) {
      return selectMenuOption;
    }

    const { emoji, ...option } = selectMenuOption;
    return {
      ...option,
      emoji: typeof emoji === 'string' ? resolvePartialEmoji(emoji) : emoji,
    };
  }

  /**
   * Adds options to this select menu
   * @param {RestOrArray<APISelectMenuOption>} options The options to add to this select menu
   * @returns {SelectMenuBuilder}
   */
  addOptions(...options) {
    return super.addOptions(normalizeArray(options).map(option => SelectMenuBuilder.normalizeEmoji(option)));
  }

  /**
   * Sets the options on this select menu
   * @param {RestOrArray<APISelectMenuOption>} options The options to set on this select menu
   * @returns {SelectMenuBuilder}
   */
  setOptions(...options) {
    return super.setOptions(normalizeArray(options).map(option => SelectMenuBuilder.normalizeEmoji(option)));
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

/**
 * @external BuildersSelectMenu
 * @see {@link https://discord.js.org/#/docs/builders/main/class/SelectMenuBuilder}
 */
