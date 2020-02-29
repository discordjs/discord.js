'use strict';

module.exports = (client, packet) => {
  client.actions.GuildIntegrationsUpdate.handle(packet.d);
};
