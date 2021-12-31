'use strict';

module.exports = (client, packet) => {
  client.actions.GuildScheduledEventUserRemove.handle(packet.d);
};
