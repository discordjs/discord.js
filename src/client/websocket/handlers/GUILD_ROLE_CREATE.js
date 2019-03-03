'use strict';

module.exports = (client, packet) => {
  client.actions.GuildRoleCreate.handle(packet.d);
};
