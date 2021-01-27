'use strict';

const Action = require('./Action');
const { Events, Status } = require('../../util/Constants');

class ServerMemberRemoveAction extends Action {
  handle(data, shard) {
    const client = this.client;
    const server = client.servers.cache.get(data.server_id);
    let member = null;
    if (server) {
      member = this.getMember({ user: data.user }, server);
      server.memberCount--;
      if (member) {
        member.deleted = true;
        server.members.cache.delete(member.id);
        /**
         * Emitted whenever a member leaves a server, or is kicked.
         * @event Client#serverMemberRemove
         * @param {ServerMember} member The member that has left/been kicked from the server
         */
        if (shard.status === Status.READY) client.emit(Events.GUILD_MEMBER_REMOVE, member);
      }
      server.voiceStates.cache.delete(data.user.id);
    }
    return { server, member };
  }
}

module.exports = ServerMemberRemoveAction;
