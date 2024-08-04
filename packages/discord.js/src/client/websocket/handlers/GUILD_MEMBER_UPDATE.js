'use strict';

module.exports = (client, packet) => {
  client.actions.GuildMemberUpdate.handle(packet.d);
};
