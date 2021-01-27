'use strict';

const Action = require('./Action');

class ServerChannelsPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const server = client.servers.cache.get(data.server_id);
    if (server) {
      for (const partialChannel of data.channels) {
        const channel = server.channels.cache.get(partialChannel.id);
        if (channel) channel.rawPosition = partialChannel.position;
      }
    }

    return { server };
  }
}

module.exports = ServerChannelsPositionUpdate;
