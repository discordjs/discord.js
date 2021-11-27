'use strict';

const { ComponentTypes, Events } = require('../util/Constants');

/**
 * A factory for creating and resolving components.
 */
class Components {
  /**
   * Constructs a MessageComponent based on the type of the incoming data
   * @param {ComponentOptions} data Data for a Component
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
        const ActionRow = require('./ActionRow');
        component = new ActionRow(data, client);
        break;
      }
      case ComponentTypes.BUTTON: {
        const ButtonComponent = require('./ButtonComponent');
        component = new ButtonComponent(data);
        break;
      }
      case ComponentTypes.SELECT_MENU: {
        const SelectMenuComponent = require('./SelectMenuComponent');
        component = new SelectMenuComponent(data);
        break;
      }
      default:
        if (client) {
          client.emit(Events.DEBUG, `[Components] Received component with unknown type: ${data.type}`);
        } else {
          throw new TypeError('INVALID_TYPE', 'data.type', 'valid ComponentType');
        }
    }
    return component;
  }
}

module.exports = Components;
