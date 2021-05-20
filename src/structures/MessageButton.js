'use strict';

const MessageComponent = require('./MessageComponent');
const { MessageButtonStyles } = require('../util/Constants.js');
const Util = require('../util/Util');
class MessageButton extends MessageComponent {
  /**
   * @typedef {Object} MessageButtonOptions
   * @property {string} [label] The text to be displayed on this button
   * @property {string} [customID] A unique string to be sent in the interaction when clicked
   * @property {MessageButtonStyle} [style] The style of this button
   * @property {?} [emoji] ???
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
    this.customID = data.custom_id ?? null;

    /**
     * The style of this button
     * @type {MessageButtonStyle}
     */
    this.style = MessageButtonStyles[data.style ?? 1];

    /**
     * Emoji for this button
     */
    this.emoji = data.emoji ?? null;

    /**
     * The URL this button links to, if it is a Link style button
     * @type {?string}
     */
    this.url = data.url ?? null;

    /**
     * Whether this button is currently disabled
     */
    this.disabled = data.disabled ?? false;
  }

  /**
   * Sets the label of this button
   * @param {string} label The text to be displayed on this button
   * @returns {MessageButton}
   */
  setLabel(label) {
    this.label = Util.resolveString(label);
    return this;
  }

  /**
   * Sets the custom ID of this button
   * @param {string} customID A unique string to be sent in the interaction when clicked
   * @returns {MessageButton}
   */
  setCustomID(customID) {
    this.customID = Util.resolveString(customID);
    return this;
  }

  /**
   * Sets the style of this button
   * @param {MessageButtonStyle} style The style of this button
   * @returns {MessageButton}
   */
  setStyle(style) {
    this.style = MessageButton.resolveStyle(style);
    return this;
  }

  static resolveStyle(style) {
    return typeof style === 'string' ? style : MessageButtonStyles[style];
  }
}

module.exports = MessageButton;
