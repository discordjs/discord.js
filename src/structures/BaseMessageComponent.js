'use strict';

const { TypeError } = require('../errors');
const { MessageComponentTypes, Events } = require('../util/Constants');

/**
 * Represents an interactive component of a Message. It should not be necessary to construct this directly.
 * See {@link MessageComponent}
 */
class BaseMessageComponent {
  /**
   * Options for a BaseMessageComponent
   * @typedef {Object} BaseMessageComponentOptions
   * @property {MessageComponentTypeResolvable} type The type of this component
   */

  /**
   * Data that can be resolved into options for a MessageComponent. This can be:
   * * MessageActionRowOptions
   * * MessageButtonOptions
   * @typedef {MessageActionRowOptions|MessageButtonOptions} MessageComponentOptions
   */

  /**
   * Components that can be sent in a message. This can be:
   * * MessageActionRow
   * * MessageButton
   * @typedef {MessageActionRow|MessageButton} MessageComponent
   */

  /**
   * Data that can be resolved to a MessageComponentType. This can be:
   * * MessageComponentType
   * * string
   * * number
   * @typedef {string|number|MessageComponentType} MessageComponentTypeResolvable
   */

  /**
   * @param {BaseMessageComponent|BaseMessageComponentOptions} [data={}] The options for this component
   */
  constructor(data) {
    /**
     * The type of this component
     * @type {?MessageComponentType}
     */
    this.type = 'type' in data ? BaseMessageComponent.resolveType(data.type) : null;
  }

  /**
   * Constructs a MessageComponent based on the type of the incoming data
   * @param {MessageComponentOptions} data Data for a MessageComponent
   * @param {Client|WebhookClient} [client] Client constructing this component
   * @param {boolean} [skipValidation=false] Whether or not to validate the component type
   * @returns {?MessageComponent}
   * @private
   */
  static create(data, client, skipValidation = false) {
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
      default:
        if (client) {
          client.emit(Events.DEBUG, `[BaseMessageComponent] Received component with unknown type: ${data.type}`);
        } else if (!skipValidation) {
          throw new TypeError('INVALID_TYPE', 'data.type', 'valid MessageComponentType');
        }
    }
    return component;
  }

  /**
   * Resolves the type of a MessageComponent
   * @param {MessageComponentTypeResolvable} type The type to resolve
   * @returns {MessageComponentType}
   * @private
   */
  static resolveType(type) {
    return typeof type === 'string' ? type : MessageComponentTypes[type];
  }
}

module.exports = BaseMessageComponent;
