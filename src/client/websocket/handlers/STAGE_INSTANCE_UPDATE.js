'use strict';

module.exports = (client, packet) => {
  client.actions.StageInstanceUpdate.handle(packet.d);
};
