'use strict';

const { SelectMenuOptionBuilder: BuildersSelectMenuOption, isJSONEncodable } = require('@discordjs/builders');
const { toSnakeCase } = require('../util/Transformers');
const { resolvePartialEmoji } = require('../util/Util');

/**
 * Represents a select menu option builder.
 * @extends {BuildersSelectMenuOption}
 */
class StringSelectMenuOptionBuilder extends BuildersSelectMenuOption {
  constructor({ emoji, ...data } = {}) {
    super(
      toSnakeCase({
        ...data,
        emoji: emoji && typeof emoji === 'string' ? resolvePartialEmoji(emoji) : emoji,
      }),
    );
  }
  /**
   * Sets the emoji to display on this option
   * @param {ComponentEmojiResolvable} emoji The emoji to display on this option
   * @returns {StringSelectMenuOptionBuilder}
   */
  setEmoji(emoji) {
    if (typeof emoji === 'string') {
      return super.setEmoji(resolvePartialEmoji(emoji));
    }
    return super.setEmoji(emoji);
  }

  /**
   * Creates a new select menu option builder from JSON data
   * @param {JSONEncodable<APISelectMenuOption>|APISelectMenuOption} other The other data
   * @returns {StringSelectMenuOptionBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = StringSelectMenuOptionBuilder;

/**
 * @external BuildersSelectMenuOption
 * @see {@link https://discord.js.org/#/docs/builders/main/class/SelectMenuOptionBuilder}
 */
