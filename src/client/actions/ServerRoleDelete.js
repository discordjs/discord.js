'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ServerRoleDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const server = client.servers.cache.get(data.server_id);
    let role;

    if (server) {
      role = server.roles.cache.get(data.role_id);
      if (role) {
        server.roles.cache.delete(data.role_id);
        role.deleted = true;
        /**
         * Emitted whenever a server role is deleted.
         * @event Client#roleDelete
         * @param {Role} role The role that was deleted
         */
        client.emit(Events.GUILD_ROLE_DELETE, role);
      }
    }

    return { role };
  }
}

module.exports = ServerRoleDeleteAction;
