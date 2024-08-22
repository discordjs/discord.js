'use strict';

module.exports = (client, packet) => {
  client.actions.EntitlementDelete.handle(packet.d);
};
