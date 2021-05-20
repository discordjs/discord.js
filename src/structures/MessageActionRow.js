'use strict';

const MessageComponent = require('./MessageComponent');

/**
 * Represents an ActionRow containing message components.
 */
class MessageActionRow extends MessageComponent {
  /**
   * @typedef {Object} MessageActionRowOptions
   * @property {MessageComponent[]} [components] The components to place in this ActionRow
   */

  /**
   * @param {MessageActionRow|MessageActionRowOptions} [data={}] MessageActionRow to clone or raw data
   */
  constructor(data = {}) {
    super({ type: 'ACTION_ROW' });

    this.components = (data.components ?? []).map(MessageComponent.create);
  }

  addButton(component) {
    return this.addButtons({ ...component });
  }

  addButtons(...components) {
    this.components.push(...components);
    return this;
  }
}

module.exports = MessageActionRow;
