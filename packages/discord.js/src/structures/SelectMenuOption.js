'use strict';

const { SelectMenuOption: BuildersSelectMenuOption } = require('@discordjs/builders');
const Util = require('../util/Util');

/**
 * Represents a select menu option
 */
class SelectMenuOption extends BuildersSelectMenuOption {
  /**
   * Sets the emoji to display on this option
   * @param {APIMessageComponentEmoji} emoji The emoji to display on this option
   * @returns {SelectMenuOption}
   */
  setEmoji(emoji) {
    if (typeof emoji === 'string') {
      return super.setEmoji(Util.parseEmoji(emoji));
    }
    return super.setEmoji(emoji);
  }
}

module.exports = SelectMenuOption;
