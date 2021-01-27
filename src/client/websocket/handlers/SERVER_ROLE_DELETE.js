'use strict';

module.exports = (client, packet) => {
  client.actions.ServerRoleDelete.handle(packet.d);
};
