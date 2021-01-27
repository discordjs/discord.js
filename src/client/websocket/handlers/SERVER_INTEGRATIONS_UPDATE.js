'use strict';

module.exports = (client, packet) => {
  client.actions.ServerIntegrationsUpdate.handle(packet.d);
};
