'use strict';

const { ButtonBuilder: BuildersButton, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

/**
 * A class to build button components to be sent through the API
 * @extends {BuildersButton}
 */
class ButtonBuilder extends BuildersButton {
  constructor({ emoji, ...data } = {}) {
    super(
      Transformers.toSnakeCase({ ...data, emoji: emoji && typeof emoji === 'string' ? Util.parseEmoji(emoji) : emoji }),
    );
  }

  /**
   * Sets the emoji to display on this button
   * @param {string|APIMessageComponentEmoji} emoji The emoji to display on this button
   * @returns {ButtonBuilder}
   */
  setEmoji(emoji) {
    if (typeof emoji === 'string') {
      return super.setEmoji(Util.parseEmoji(emoji));
    }
    return super.setEmoji(emoji);
  }

  /**
   * Creates a new button builder from JSON data
   * @param {JSONEncodable<APIButtonComponent>|APIButtonComponent} other The other data
   * @returns {ButtonBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }

  /**
   * A unique string to be sent in the interaction when clicked
   * @type {string}
   * @readonly
   */
  get customId() {
    return this.data.custom_id ?? null;
  }

  /**
   * Whether this button is currently disabled
   * @type {boolean}
   * @readonly
   */
  get disabled() {
    return this.data.disabled ?? null;
  }

  /**
   * Emoji for this button
   * @type {?APIMessageComponentEmoji}
   * @readonly
   */
  get emoji() {
    return this.data.emoji ?? null;
  }

  /**
   * The text to be displayed on this button
   * @type {string}
   * @readonly
   */
  get label() {
    return this.data.label ?? null;
  }

  /**
   * The style of a button represented as a number. This can be:
   * * 1 - Primary
   * * 2 - Secondary
   * * 3 - Success
   * * 4 - Danger
   * * 5 - Link
   * @see {@link https://discord.com/developers/docs/interactions/message-components#button-object-button-styles}
   * @typedef {number} ButtonStyle
   */

  /**
   * The style of this button
   * @type {ButtonStyle}
   * @readonly
   */
  get style() {
    return this.data.style ?? null;
  }

  /**
   * The URL this button links to, if it is a Link style button
   * @type {string}
   * @readonly
   */
  get url() {
    return this.data.url ?? null;
  }
}

module.exports = ButtonBuilder;

/**
 * @external BuildersButton
 * @see {@link https://discord.js.org/#/docs/builders/main/class/ButtonBuilder}
 */
