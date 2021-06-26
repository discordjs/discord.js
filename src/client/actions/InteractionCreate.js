'use strict';

const Action = require('./Action');
const { Events, InteractionTypes, MessageComponentTypes } = require('../../util/Constants');
const Structures = require('../../util/Structures');

class InteractionCreateAction extends Action {
  handle(data) {
    const client = this.client;

    // Resolve and cache partial channels for Interaction#channel getter
    this.getChannel(data);

    let InteractionType;
    switch (data.type) {
      case InteractionTypes.APPLICATION_COMMAND:
        InteractionType = Structures.get('CommandInteraction');
        break;
      case InteractionTypes.MESSAGE_COMPONENT:
        switch (data.data.component_type) {
          case MessageComponentTypes.BUTTON:
            InteractionType = Structures.get('ButtonInteraction');
            break;
          case MessageComponentTypes.SELECT_MENU:
            InteractionType = Structures.get('SelectMenuInteraction');
            break;
          default:
            client.emit(
              Events.DEBUG,
              `[INTERACTION] Received component interaction with unknown type: ${data.data.component_type}`,
            );
            return;
        }
        break;
      default:
        client.emit(Events.DEBUG, `[INTERACTION] Received interaction with unknown type: ${data.type}`);
        return;
    }

    /**
     * Emitted when an interaction is created.
     * @event Client#interaction
     * @param {Interaction} interaction The interaction which was created
     */
    client.emit(Events.INTERACTION_CREATE, new InteractionType(client, data));
  }
}

module.exports = InteractionCreateAction;
