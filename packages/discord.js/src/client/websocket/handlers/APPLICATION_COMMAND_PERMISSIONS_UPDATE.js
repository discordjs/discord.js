'use strict';

module.exports = (client, packet) => {
  client.actions.ApplicationCommandPermissionsUpdate.handle(packet.d);
};
