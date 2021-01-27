'use strict';

module.exports = (client, packet) => {
  client.actions.ServerUpdate.handle(packet.d);
};
