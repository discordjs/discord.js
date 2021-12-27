'use strict';

module.exports = (client, packet) => {
  client.actions.GuildDelete.handle(packet.d);
};
