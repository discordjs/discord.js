'use strict';

module.exports = (client, packet) => {
  client.actions.EntitlementCreate.handle(packet.d);
};
