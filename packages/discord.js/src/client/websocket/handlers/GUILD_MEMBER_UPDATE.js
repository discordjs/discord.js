'use strict';

module.exports = (client, packet, shard) => {
  client.actions.GuildMemberUpdate.handle(packet.d, shard);
};
