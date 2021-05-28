'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const { MessageComponentTypes } = require('../util/Constants');

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

    this.components = (data.components ?? []).map(c => BaseMessageComponent.create(c, null, true));
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
    this.components.push(...components.map(c => BaseMessageComponent.create(c, null, true)));
    return this;
  }

  /**
   * Transforms the action row to a plain object.
   * @returns {Object} The raw data of this action row
   */
  toJSON() {
    return {
      components: this.components.map(c => c.toJSON()),
      type: typeof this.type === 'string' ? MessageComponentTypes[this.type] : this.type,
    };
  }
}

module.exports = MessageActionRow;
