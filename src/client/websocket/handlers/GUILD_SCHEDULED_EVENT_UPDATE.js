'use strict';

module.exports = (client, packet) => {
  client.actions.GuildScheduledEventUpdate.handle(packet.d);
};
