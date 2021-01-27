'use strict';

const Action = require('./Action');

class ServerRolesPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const server = client.servers.cache.get(data.server_id);
    if (server) {
      for (const partialRole of data.roles) {
        const role = server.roles.cache.get(partialRole.id);
        if (role) role.rawPosition = partialRole.position;
      }
    }

    return { server };
  }
}

module.exports = ServerRolesPositionUpdate;
