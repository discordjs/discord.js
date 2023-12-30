'use strict';

module.exports = (client, packet) => {
  client.actions.EntitlementUpdate.handle(packet.d);
};
