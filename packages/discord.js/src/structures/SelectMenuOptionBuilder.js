'use strict';

const { SelectMenuOptionBuilder: BuildersSelectMenuOption, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

/**
 * Represents a select menu option builder.
 * @extends {BuildersSelectMenuOption}
 */
class SelectMenuOptionBuilder extends BuildersSelectMenuOption {
  constructor({ emoji, ...data } = {}) {
    super(
      Transformers.toSnakeCase({
        ...data,
        emoji: emoji && typeof emoji === 'string' ? Util.parseEmoji(emoji) : emoji,
      }),
    );
  }
  /**
   * Sets the emoji to display on this option
   * @param {ComponentEmojiResolvable} emoji The emoji to display on this option
   * @returns {SelectMenuOptionBuilder}
   */
  setEmoji(emoji) {
    if (typeof emoji === 'string') {
      return super.setEmoji(Util.parseEmoji(emoji));
    }
    return super.setEmoji(emoji);
  }

  /**
   * Creates a new select menu option builder from JSON data
   * @param {JSONEncodable<APISelectMenuOption>|APISelectMenuOption} other The other data
   * @returns {SelectMenuOptionBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }
}

module.exports = SelectMenuOptionBuilder;

/**
 * @external BuildersSelectMenuOption
 * @see {@link https://discord.js.org/#/docs/builders/main/class/SelectMenuOptionBuilder}
 */
