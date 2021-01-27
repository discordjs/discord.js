'use strict';

const Action = require('./Action');
const { Status, Events } = require('../../util/Constants');

class ServerMemberUpdateAction extends Action {
  handle(data, shard) {
    const { client } = this;
    if (data.user.username) {
      const user = client.users.cache.get(data.user.id);
      if (!user) {
        client.users.add(data.user);
      } else if (!user.equals(data.user)) {
        client.actions.UserUpdate.handle(data.user);
      }
    }

    const server = client.servers.cache.get(data.server_id);
    if (server) {
      const member = this.getMember({ user: data.user }, server);
      if (member) {
        const old = member._update(data);
        /**
         * Emitted whenever a server member changes - i.e. new role, removed role, nickname.
         * Also emitted when the user's details (e.g. username) change.
         * @event Client#serverMemberUpdate
         * @param {ServerMember} oldMember The member before the update
         * @param {ServerMember} newMember The member after the update
         */
        if (shard.status === Status.READY) client.emit(Events.GUILD_MEMBER_UPDATE, old, member);
      } else {
        const newMember = server.members.add(data);
        /**
         * Emitted whenever a member becomes available in a large server.
         * @event Client#serverMemberAvailable
         * @param {ServerMember} member The member that became available
         */
        this.client.emit(Events.GUILD_MEMBER_AVAILABLE, newMember);
      }
    }
  }
}

module.exports = ServerMemberUpdateAction;
