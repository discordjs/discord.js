'use strict';

const MessageComponent = require('./MessageComponent');

/**
 * Represents an ActionBar containing message components.
 */
class MessageActionBar extends MessageComponent {
  /**
   * @typedef {Object} MessageActionBarOptions
   * @property {MessageComponent[]} [components] The components to place in this ActionBar
   */

  /**
   * @param {MessageActionBarOptions} [options] The options for this MessageActionBar
   */
  constructor(options) {
    super({ type: 'ACTION_BAR' });

    this.components = options?.components ?? [];
  }

  addComponent(component) {
    return this.addComponents({ ...component });
  }

  addComponents(...components) {
    this.buttons.push(...this.constructor.normalizeComponents(components));
    return this;
  }
}

module.exports = MessageActionBar;
