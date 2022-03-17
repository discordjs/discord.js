'use strict';

const {
  SelectMenuBuilder: BuildersSelectMenu,
  isJSONEncodable,
  SelectMenuOptionBuilder,
} = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

/**
 * Class used to build Select Menu components to be sent through the API
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
    this.options = this.data.options.map(option => new SelectMenuOptionBuilder(option));
  }

  /**
   * Adds options to this select menu
   * @param {APISelectMenuOption[]} options The options to add to this select menu
   * @returns {SelectMenuBuilder}
   */
  addOptions(options) {
    return super.addOptions(
      options.map(({ emoji, ...option }) => ({
        ...option,
        emoji: emoji && typeof emoji === 'string' ? Util.parseEmoji(emoji) : emoji,
      })),
    );
  }

  /**
   * Sets the options on this select menu
   * @param {APISelectMenuOption[]} options The options to set on this select menu
   * @returns {SelectMenuBuilder}
   */
  setOptions(options) {
    return super.setOptions(
      options.map(({ emoji, ...option }) => ({
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

  /**
   * Text to be displayed if nothing is selected on this select menu component
   * @type {?string}
   * @readonly
   */
  get placeholder() {
    return this.data.placeholder ?? null;
  }

  /**
   * The minimum number of items that must be chosen
   * @type {?number}
   * @readonly
   */
  get minValues() {
    return this.data.min_values ?? null;
  }

  /**
   * The maximum number of items that must be chosen
   * @type {?number}
   * @readonly
   */
  get maxValues() {
    return this.data.max_values ?? null;
  }

  /**
   * A developer-defined identifier for this select menu component
   * @type {?string}
   * @readonly
   */
  get customId() {
    return this.data.custom_id ?? null;
  }

  /**
   * Whether this select menu component is disabled
   * @type {?boolean}
   * @readonly
   */
  get disabled() {
    return this.data.disabled ?? null;
  }
}

module.exports = SelectMenuBuilder;

/**
 * @external BuildersSelectMenu
 * @see {@link https://discord.js.org/#/docs/builders/main/class/SelectMenuBuilder}
 */
