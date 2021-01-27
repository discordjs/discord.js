'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ServerRoleCreate extends Action {
  handle(data) {
    const client = this.client;
    const server = client.servers.cache.get(data.server_id);
    let role;
    if (server) {
      const already = server.roles.cache.has(data.role.id);
      role = server.roles.add(data.role);
      /**
       * Emitted whenever a role is created.
       * @event Client#roleCreate
       * @param {Role} role The role that was created
       */
      if (!already) client.emit(Events.GUILD_ROLE_CREATE, role);
    }
    return { role };
  }
}

module.exports = ServerRoleCreate;
