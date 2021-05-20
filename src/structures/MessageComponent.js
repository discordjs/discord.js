'use strict';

const { MessageComponentTypes, MessageButtonStyles } = require('../util/Constants');

/**
 * Represents an interactive component of a Message. It should not be necessary to construct this directly.
 */
class MessageComponent {
  /**
   * @typedef {Object} MessageComponentOptions
   * @property {MessageComponentType} type The type of this component
   */

  /**
   * @param {MessageComponent|MessageComponentOptions} [data={}] The options for this MessageComponent
   */
  constructor(data) {
    /**
     * The type of this component
     * @type {?MessageComponentType}
     */
    this.type = 'type' in data ? data.type : null;
  }

  /**
   * Sets the type of this component;
   * @param {MessageComponentType} type The type of this component
   * @returns {MessageComponent}
   */
  setType(type) {
    this.type = type;
    return this;
  }

  static create(data) {
    let component;
    switch (data.type) {
      case MessageComponentTypes.ACTION_ROW: {
        const MessageActionRow = require('./MessageActionRow');
        component = new MessageActionRow(data);
        break;
      }
      case MessageComponentTypes.BUTTON: {
        const MessageButton = require('./MessageButton');
        component = new MessageButton(data);
        break;
      }
    }
    console.log('Created', component);
    return component;
  }

  static transform(component) {
    const { type, components, label, customID, style, emoji, url, disabled } = component;

    return {
      components: components?.map(MessageComponent.transform),
      custom_id: customID,
      disabled,
      emoji,
      label,
      style: MessageButtonStyles[style],
      type: MessageComponentTypes[type],
      url,
    };
  }
}

module.exports = MessageComponent;
