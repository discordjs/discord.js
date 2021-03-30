'use strict';

const CommandInteraction = require('../../../structures/CommandInteraction');
const { Events, InteractionTypes } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  if (data.type === InteractionTypes.APPLICATION_COMMAND) {
    const interaction = new CommandInteraction(client, data);

    /**
     * Emitted when an interaction is created.
     * @event Client#interaction
     * @param {Interaction} interaction The interaction which was created
     */
    return client.emit(Events.INTERACTION_CREATE, interaction);
  }

  return client.emit('debug', `[INTERACTION] Received interaction with unknown type: ${data.type}`);
};
