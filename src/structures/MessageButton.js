'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const { RangeError } = require('../errors');
const { MessageButtonStyles, MessageComponentTypes } = require('../util/Constants');
const Util = require('../util/Util');

/**
 * Represents a button message component.
 * @extends {BaseMessageComponent}
 */
class MessageButton extends BaseMessageComponent {
  /**
   * @typedef {BaseMessageComponentOptions} MessageButtonOptions
   * @property {string} [label] The text to be displayed on this button
   * @property {string} [customId] A unique string to be sent in the interaction when clicked
   * @property {MessageButtonStyleResolvable} [style] The style of this button
   * @property {EmojiIdentifierResolvable} [emoji] The emoji to be displayed to the left of the text
   * @property {string} [url] Optional URL for link-style buttons
   * @property {boolean} [disabled=false] Disables the button to prevent interactions
   */

  /**
   * @param {MessageButton|MessageButtonOptions} [data={}] MessageButton to clone or raw data
   */
  constructor(data = {}) {
    super({ type: 'BUTTON' });

    this.setup(data);
  }

  setup(data) {
    /**
     * The text to be displayed on this button
     * @type {?string}
     */
    this.label = data.label ?? null;

    /**
     * A unique string to be sent in the interaction when clicked
     * @type {?string}
     */
    this.customId = data.custom_id ?? data.customId ?? null;

    /**
     * The style of this button
     * @type {?MessageButtonStyle}
     */
    this.style = data.style ? MessageButton.resolveStyle(data.style) : null;

    /**
     * Emoji for this button
     * @type {?RawEmoji}
     */
    this.emoji = data.emoji ? Util.resolvePartialEmoji(data.emoji) : null;

    /**
     * The URL this button links to, if it is a Link style button
     * @type {?string}
     */
    this.url = data.url ?? null;

    /**
     * Whether this button is currently disabled
     * @type {boolean}
     */
    this.disabled = data.disabled ?? false;
  }

  /**
   * Sets the custom id for this button
   * @param {string} customId A unique string to be sent in the interaction when clicked
   * @returns {MessageButton}
   */
  setCustomId(customId) {
    this.customId = Util.verifyString(customId, RangeError, 'BUTTON_CUSTOM_ID');
    return this;
  }

  /**
   * Sets the interactive status of the button
   * @param {boolean} [disabled=true] Whether this button should be disabled
   * @returns {MessageButton}
   */
  setDisabled(disabled = true) {
    this.disabled = disabled;
    return this;
  }

  /**
   * Set the emoji of this button
   * @param {EmojiIdentifierResolvable} emoji The emoji to be displayed on this button
   * @returns {MessageButton}
   */
  setEmoji(emoji) {
    this.emoji = Util.resolvePartialEmoji(emoji);
    return this;
  }

  /**
   * Sets the label of this button
   * @param {string} label The text to be displayed on this button
   * @returns {MessageButton}
   */
  setLabel(label) {
    this.label = Util.verifyString(label, RangeError, 'BUTTON_LABEL');
    return this;
  }

  /**
   * Sets the style of this button
   * @param {MessageButtonStyleResolvable} style The style of this button
   * @returns {MessageButton}
   */
  setStyle(style) {
    this.style = MessageButton.resolveStyle(style);
    return this;
  }

  /**
   * Sets the URL of this button.
   * <note>MessageButton#style must be LINK when setting a URL</note>
   * @param {string} url The URL of this button
   * @returns {MessageButton}
   */
  setURL(url) {
    this.url = Util.verifyString(url, RangeError, 'BUTTON_URL');
    return this;
  }

  /**
   * Transforms the button to a plain object.
   * @returns {APIMessageComponent} The raw data of this button
   */
  toJSON() {
    return {
      custom_id: this.customId,
      disabled: this.disabled,
      emoji: this.emoji,
      label: this.label,
      style: MessageButtonStyles[this.style],
      type: MessageComponentTypes[this.type],
      url: this.url,
    };
  }

  /**
   * Data that can be resolved to a MessageButtonStyle. This can be
   * * MessageButtonStyle
   * * number
   * @typedef {number|MessageButtonStyle} MessageButtonStyleResolvable
   */

  /**
   * Resolves the style of a button
   * @param {MessageButtonStyleResolvable} style The style to resolve
   * @returns {MessageButtonStyle}
   * @private
   */
  static resolveStyle(style) {
    return typeof style === 'string' ? style : MessageButtonStyles[style];
  }
}

module.exports = MessageButton;
