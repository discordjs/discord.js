'use strict';

module.exports = (client, packet) => {
  client.actions.GuildBanAdd.handle(packet.d);
};
