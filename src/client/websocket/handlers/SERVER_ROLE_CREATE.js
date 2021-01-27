'use strict';

module.exports = (client, packet) => {
  client.actions.ServerRoleCreate.handle(packet.d);
};
