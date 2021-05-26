'use strict';

const { MessageComponentTypes, MessageButtonStyles } = require('../util/Constants');

/**
 * Represents an interactive component of a Message. It should not be necessary to construct this directly.
 */
class BaseMessageComponent {
  /**
   * @typedef {Object} BaseMessageComponentOptions
   * @property {MessageComponentType} type The type of this component
   */

  /**
   * @param {BaseMessageComponent|BaseMessageComponentOptions} [data={}] The options for this component
   */
  constructor(data) {
    /**
     * The type of this component
     * @type {?MessageComponentType}
     */
    this.type = 'type' in data ? data.type : null;
  }

  /**
   * Sets the type of this component
   * @param {MessageComponentType} type The type of this component
   * @returns {BaseMessageComponent}
   */
  setType(type) {
    this.type = type;
    return this;
  }

  static create(data) {
    let component;
    let type = data.type;

    if (typeof type === 'string') type = MessageComponentTypes[type];

    switch (type) {
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
    return component;
  }

  static transform(component) {
    const { type, components, label, customID, style, emoji, url, disabled } = component;

    return {
      components: components?.map(BaseMessageComponent.transform),
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

module.exports = BaseMessageComponent;
