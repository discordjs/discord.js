'use strict';

module.exports = (client, packet) => {
  client.actions.GuildScheduledEventCreate.handle(packet.d);
};
