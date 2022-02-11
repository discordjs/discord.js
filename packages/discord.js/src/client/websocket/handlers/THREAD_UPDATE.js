'use strict';

const Events = require('../../../util/Events');

module.exports = (client, packet) => {
  const { old, updated } = client.actions.ChannelUpdate.handle(packet.d);
  if (old && updated) {
    /**
     * Emitted whenever a thread is updated - e.g. name change, archive state change, locked state change.
     * @event Client#threadUpdate
     * @param {ThreadChannel} oldThread The thread before the update
     * @param {ThreadChannel} newThread The thread after the update
     */
    client.emit(Events.ThreadUpdate, old, updated);
  }
};
