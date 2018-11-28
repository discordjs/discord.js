'use strict';

module.exports = (client, packet) => {
  client.actions.GuildSync.handle(packet.d);
};
