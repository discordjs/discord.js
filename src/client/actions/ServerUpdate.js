'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ServerUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const server = client.servers.cache.get(data.id);
    if (server) {
      const old = server._update(data);
      /**
       * Emitted whenever a server is updated - e.g. name change.
       * @event Client#serverUpdate
       * @param {Server} oldServer The server before the update
       * @param {Server} newServer The server after the update
       */
      client.emit(Events.GUILD_UPDATE, old, server);
      return {
        old,
        updated: server,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = ServerUpdateAction;
