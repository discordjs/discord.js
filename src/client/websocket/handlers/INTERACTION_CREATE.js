'use strict';

const { Events, InteractionTypes, MessageComponentTypes } = require('../../../util/Constants');
const Structures = require('../../../util/Structures');

module.exports = (client, { d: data }) => {
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
};
