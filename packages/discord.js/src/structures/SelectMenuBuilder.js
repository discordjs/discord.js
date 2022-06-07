'use strict';

const { SelectMenuBuilder: BuildersSelectMenu, isJSONEncodable, normalizeArray } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

/**
 * Class used to build select menu components to be sent through the API
 * @extends {BuildersSelectMenu}
 */
class SelectMenuBuilder extends BuildersSelectMenu {
  constructor({ options, ...data } = {}) {
    super(
      Transformers.toSnakeCase({
        ...data,
        options: options?.map(({ emoji, ...option }) => ({
          ...option,
          emoji: emoji && typeof emoji === 'string' ? Util.parseEmoji(emoji) : emoji,
        })),
      }),
    );
  }

  /**
   * Adds options to this select menu
   * @param {RestOrArray<APISelectMenuOption>} options The options to add to this select menu
   * @returns {SelectMenuBuilder}
   */
  addOptions(...options) {
    const _options = normalizeArray(options);
    return super.addOptions(
      _options.map(({ emoji, ...option }) => ({
        ...option,
        emoji: emoji && typeof emoji === 'string' ? Util.parseEmoji(emoji) : emoji,
      })),
    );
  }

  /**
   * Sets the options on this select menu
   * @param {RestOrArray<APISelectMenuOption>} options The options to set on this select menu
   * @returns {SelectMenuBuilder}
   */
  setOptions(...options) {
    const _options = normalizeArray(options);
    return super.setOptions(
      _options.map(({ emoji, ...option }) => ({
        ...option,
        emoji: emoji && typeof emoji === 'string' ? Util.parseEmoji(emoji) : emoji,
      })),
    );
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
