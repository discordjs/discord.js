'use strict';

module.exports = (client, packet) => {
  client.actions.GuildBanRemove.handle(packet.d);
};
