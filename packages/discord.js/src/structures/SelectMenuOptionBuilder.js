'use strict';

const { SelectMenuOptionBuilder: BuildersSelectMenuOption } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

/**
 * Class used to build select menu options to be sent through the API
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
   * The label of this select menu option
   * @type {?string}
   * @readonly
   */
  get label() {
    return this.data.label ?? null;
  }

  /**
   * The sent through the interaction when this option is picked
   * @type {?string}
   * @readonly
   */
  get value() {
    return this.data.value ?? null;
  }

  /**
   * The description of this select menu option
   * @type {?string}
   * @readonly
   */
  get description() {
    return this.data.description ?? null;
  }

  /**
   * The emoji displayed beside this select menu option
   * @type {?APIMessageComponentEmoji}
   * @readonly
   */
  get emoji() {
    return this.data.emoji ?? null;
  }

  /**
   * Whether this option is the default option in a select menu component
   * @type {?boolean}
   * @readonly
   */
  get default() {
    return this.data.default ?? null;
  }
}

module.exports = SelectMenuOptionBuilder;

/**
 * @external BuildersSelectMenuOption
 * @see {@link https://discord.js.org/#/docs/builders/main/class/SelectMenuOptionBuilder}
 */
