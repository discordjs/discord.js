'use strict';

const { SelectMenuOptionBuilder: BuildersSelectMenuOption } = require('@discordjs/builders');
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
}

module.exports = SelectMenuOptionBuilder;

/**
 * @external BuildersSelectMenuOption
 * @see {@link https://discord.js.org/#/docs/builders/main/class/SelectMenuOptionBuilder}
 */
