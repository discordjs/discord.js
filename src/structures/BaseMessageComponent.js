'use strict';

const { TypeError } = require('../errors');
const { MessageComponentTypes, Events } = require('../util/Constants');

/**
 * Represents an interactive component of a Message or Modal. It should not be necessary to construct this directly.
 * See {@link MessageComponent}
 */
class BaseMessageComponent {
  /**
   * Options for a BaseMessageComponent
   * @typedef {Object} BaseMessageComponentOptions
   * @property {MessageComponentTypeResolvable} type The type of this component
   */

  /**
   * Data that can be resolved into options for a component. This can be:
   * * MessageActionRowOptions
   * * MessageButtonOptions
   * * MessageSelectMenuOptions
   * * TextInputComponentOptions
   * @typedef {MessageActionRowOptions|MessageButtonOptions|MessageSelectMenuOptions} MessageComponentOptions
   */

  /**
   * Components that can be sent in a payload. These can be:
   * * MessageActionRow
   * * MessageButton
   * * MessageSelectMenu
   * * TextInputComponent
   * @typedef {MessageActionRow|MessageButton|MessageSelectMenu} MessageComponent
   * @see {@link https://discord.com/developers/docs/interactions/message-components#component-object-component-types}
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
   * Constructs a component based on the type of the incoming data
   * @param {MessageComponentOptions} data Data for a MessageComponent
   * @param {Client|WebhookClient} [client] Client constructing this component
   * @returns {?(MessageComponent|ModalComponent)}
   * @private
   */
  static create(data, client) {
    let component;
    let type = data.type;

    if (typeof type === 'string') type = MessageComponentTypes[type];

    switch (type) {
      case MessageComponentTypes.ACTION_ROW: {
        const MessageActionRow = require('./MessageActionRow');
        component = data instanceof MessageActionRow ? data : new MessageActionRow(data, client);
        break;
      }
      case MessageComponentTypes.BUTTON: {
        const MessageButton = require('./MessageButton');
        component = data instanceof MessageButton ? data : new MessageButton(data);
        break;
      }
      case MessageComponentTypes.SELECT_MENU: {
        const MessageSelectMenu = require('./MessageSelectMenu');
        component = data instanceof MessageSelectMenu ? data : new MessageSelectMenu(data);
        break;
      }
      case MessageComponentTypes.TEXT_INPUT: {
        const TextInputComponent = require('./TextInputComponent');
        component = data instanceof TextInputComponent ? data : new TextInputComponent(data);
        break;
      }
      default:
        if (client) {
          client.emit(Events.DEBUG, `[BaseMessageComponent] Received component with unknown type: ${data.type}`);
        } else {
          throw new TypeError('INVALID_TYPE', 'data.type', 'valid MessageComponentType');
        }
    }
    return component;
  }

  /**
   * Resolves the type of a component
   * @param {MessageComponentTypeResolvable} type The type to resolve
   * @returns {MessageComponentType}
   * @private
   */
  static resolveType(type) {
    return typeof type === 'string' ? type : MessageComponentTypes[type];
  }
}

module.exports = BaseMessageComponent;
