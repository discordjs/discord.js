'use strict';

const { ComponentTypes, Events } = require('./util/Constants');

/**
 * A factory for creating and resolving components.
 */
class Components {
  /**
   * Constructs a MessageComponent based on the type of the incoming data
   * @param {MessageComponentOptions} data Data for a MessageComponent
   * @param {Client|WebhookClient} [client] Client constructing this component
   * @returns {?MessageComponent}
   * @private
   */
  static create(data, client) {
    let component;
    let type = data.type;

    if (typeof type === 'string') type = ComponentTypes[type];

    switch (type) {
      case ComponentTypes.ACTION_ROW: {
        const MessageActionRow = require('./MessageActionRow');
        component = new MessageActionRow(data, client);
        break;
      }
      case ComponentTypes.BUTTON: {
        const MessageButton = require('./MessageButton');
        component = new MessageButton(data);
        break;
      }
      case ComponentTypes.SELECT_MENU: {
        const MessageSelectMenu = require('./MessageSelectMenu');
        component = new MessageSelectMenu(data);
        break;
      }
      default:
        if (client) {
          client.emit(Events.DEBUG, `[Components] Received component with unknown type: ${data.type}`);
        } else {
          throw new TypeError('INVALID_TYPE', 'data.type', 'valid MessageComponentType');
        }
    }
    return component;
  }
}

module.exports = Components;
