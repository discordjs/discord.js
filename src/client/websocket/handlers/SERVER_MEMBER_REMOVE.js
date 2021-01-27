'use strict';

module.exports = (client, packet, shard) => {
  client.actions.ServerMemberRemove.handle(packet.d, shard);
};
