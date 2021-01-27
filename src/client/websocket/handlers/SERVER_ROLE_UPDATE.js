'use strict';

module.exports = (client, packet) => {
  client.actions.ServerRoleUpdate.handle(packet.d);
};
