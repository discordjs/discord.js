'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ServerDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;

    let server = client.servers.cache.get(data.id);
    if (server) {
      for (const channel of server.channels.cache.values()) {
        if (channel.type === 'text') channel.stopTyping(true);
      }

      if (data.unavailable) {
        // Server is unavailable
        server.available = false;

        /**
         * Emitted whenever a server becomes unavailable, likely due to a server outage.
         * @event Client#serverUnavailable
         * @param {Server} server The server that has become unavailable
         */
        client.emit(Events.GUILD_UNAVAILABLE, server);

        // Stops the ServerDelete packet thinking a server was actually deleted,
        // handles emitting of event itself
        return {
          server: null,
        };
      }

      for (const channel of server.channels.cache.values()) this.client.channels.remove(channel.id);
      server.me?.voice.connection?.disconnect();

      // Delete server
      client.servers.cache.delete(server.id);
      server.deleted = true;

      /**
       * Emitted whenever a server kicks the client or the server is deleted/left.
       * @event Client#serverDelete
       * @param {Server} server The server that was deleted
       */
      client.emit(Events.GUILD_DELETE, server);

      this.deleted.set(server.id, server);
      this.scheduleForDeletion(server.id);
    } else {
      server = this.deleted.get(data.id) || null;
    }

    return { server };
  }

  scheduleForDeletion(id) {
    this.client.setTimeout(() => this.deleted.delete(id), this.client.options.restWsBridgeTimeout);
  }
}

module.exports = ServerDeleteAction;
