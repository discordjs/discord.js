'use strict';

module.exports = (client, packet, shard) => {
  client.actions.ServerMemberUpdate.handle(packet.d, shard);
};
