'use strict';

const { Events, InteractionTypes } = require('../../../util/Constants');
let Structures;

module.exports = (client, { d: data }) => {
  if (data.type === InteractionTypes.APPLICATION_COMMAND) {
    if (!Structures) Structures = require('../../../util/Structures');
    const CommandInteraction = Structures.get('CommandInteraction');

    const interaction = new CommandInteraction(client, data);

    /**
     * Emitted when an interaction is created.
     * @event Client#interaction
     * @param {Interaction} interaction The interaction which was created
     */
    client.emit(Events.INTERACTION_CREATE, interaction);
    return;
  }

  client.emit(Events.DEBUG, `[INTERACTION] Received interaction with unknown type: ${data.type}`);
};
