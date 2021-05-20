'use strict';

const { MessageComponentTypes } = require('../util/Constants');

/**
 * Represents an interactive component of a Message. It should not be necessary to construct this directly.
 */
class MessageComponent {
  /**
   * @typedef {Object} MessageComponentOptions
   * @property {MessageComponentType} type The type of this component
   */

  /**
   * @param {MessageComponentOptions} options The options for this MessageComponent
   */
  constructor(options) {
    /**
     * The type of this component
     * @type {MessageComponentType}
     */
    this.type = MessageComponentTypes[options.type];
  }
}

module.exports = MessageComponent;
