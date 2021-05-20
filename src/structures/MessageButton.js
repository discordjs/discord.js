'use strict';

const MessageComponent = require('./MessageComponent');
const { MessageButtonStyles } = require('../util/Constants.js');

class MessageButton extends MessageComponent {
  /**
   * @typedef {Object} MessageButtonOptions
   * @property {string} label The text to be displayed on this button
   * @property {string} customID A unique string to be sent in the interaction when clicked
   * @property {MessageButtonStyle} [style] The style of this button
   * @property {?} emoji ???
   * @property {string} [url] Optional URL for link-style buttons
   * @property {boolean} [disabled=false] Disables the button to prevent interactions
   */

  /**
   * @param {MessageButtonOptions} options The options for this MessageButton
   */
  constructor(options) {
    super({ type: 2 });

    this.label = options.label;

    this.customID = options.customID;

    this.style = options.style ?? MessageButtonStyles.PRIMARY;

    this.emoji = options.emoji;

    // Check for style first?
    this.url = options.url;

    this.disabled = options.disabled ?? false;
  }
}

module.exports = MessageButton;
