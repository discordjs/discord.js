'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');

/**
 * Represents an ActionRow containing message components.
 */
class MessageActionRow extends BaseMessageComponent {
  /**
   * @typedef {BaseMessageComponentOptions} MessageActionRowOptions
   * @property {MessageComponent[]|MessageComponentOptions[]} [components] The components to place in this ActionRow
   */

  /**
   * @param {MessageActionRow|MessageActionRowOptions} [data={}] MessageActionRow to clone or raw data
   */
  constructor(data = {}) {
    super({ type: 'ACTION_ROW' });

    this.components = (data.components ?? []).map(BaseMessageComponent.create);
  }

  /**
   * Adds a component to the row (max 5).
   * @param {MessageComponent|MessageComponentOptions} component The component to add
   * @returns {MessageActionRow}
   */
  addComponent(component) {
    return this.addComponents({ ...component });
  }

  /**
   * Adds components to the row (max 5).
   * @param {...(MessageComponent[]|MessageComponentOptions[])} components The components to add
   * @returns {MessageActionRow}
   */
  addComponents(...components) {
    this.components.push(...components.map(BaseMessageComponent.create));
    return this;
  }
}

module.exports = MessageActionRow;
