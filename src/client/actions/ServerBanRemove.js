'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ServerBanRemove extends Action {
  handle(data) {
    const client = this.client;
    const server = client.servers.cache.get(data.server_id);
    const user = client.users.add(data.user);
    /**
     * Emitted whenever a member is unbanned from a server.
     * @event Client#serverBanRemove
     * @param {Server} server The server that the unban occurred in
     * @param {User} user The user that was unbanned
     */
    if (server && user) client.emit(Events.GUILD_BAN_REMOVE, server, user);
  }
}

module.exports = ServerBanRemove;
