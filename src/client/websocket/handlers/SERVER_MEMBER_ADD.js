'use strict';

const { Events, Status } = require('../../../util/Constants');

module.exports = (client, { d: data }, shard) => {
  const server = client.servers.cache.get(data.server_id);
  if (server) {
    server.memberCount++;
    const member = server.members.add(data);
    if (shard.status === Status.READY) {
      /**
       * Emitted whenever a user joins a server.
       * @event Client#serverMemberAdd
       * @param {ServerMember} member The member that has joined a server
       */
      client.emit(Events.GUILD_MEMBER_ADD, member);
    }
  }
};
