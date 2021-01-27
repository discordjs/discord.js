'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ServerRoleUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const server = client.servers.cache.get(data.server_id);

    if (server) {
      let old = null;

      const role = server.roles.cache.get(data.role.id);
      if (role) {
        old = role._update(data.role);
        /**
         * Emitted whenever a server role is updated.
         * @event Client#roleUpdate
         * @param {Role} oldRole The role before the update
         * @param {Role} newRole The role after the update
         */
        client.emit(Events.GUILD_ROLE_UPDATE, old, role);
      }

      return {
        old,
        updated: role,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = ServerRoleUpdateAction;
