'use strict';

module.exports = (client, packet) => {
  client.actions.StageInstanceCreate.handle(packet.d);
};
