'use strict';

const { Events, InteractionTypes } = require('../../../util/Constants');
let Structures;

module.exports = (client, { d: data }) => {
  let interaction;
  switch (data.type) {
    case InteractionTypes.APPLICATION_COMMAND: {
      if (!Structures) Structures = require('../../../util/Structures');
      const CommandInteraction = Structures.get('CommandInteraction');

      interaction = new CommandInteraction(client, data);
      break;
    }
    case InteractionTypes.MESSAGE_COMPONENT: {
      if (!Structures) Structures = require('../../../util/Structures');
      const MessageComponentInteraction = Structures.get('MessageComponentInteraction');

      interaction = new MessageComponentInteraction(client, data);
      break;
    }
    default:
      client.emit(Events.DEBUG, `[INTERACTION] Received interaction with unknown type: ${data.type}`);
      return;
  }

  /**
   * Emitted when an interaction is created.
   * @event Client#interaction
   * @param {Interaction} interaction The interaction which was created
   */
  client.emit(Events.INTERACTION_CREATE, interaction);
};
