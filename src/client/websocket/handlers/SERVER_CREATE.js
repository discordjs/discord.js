'use strict';

const { Events, Status } = require('../../../util/Constants');

module.exports = (client, { d: data }, shard) => {
  let server = client.servers.cache.get(data.id);
  if (server) {
    if (!server.available && !data.unavailable) {
      // A newly available server
      server._patch(data);
    }
  } else {
    // A new server
    data.shardID = shard.id;
    server = client.servers.add(data);
    if (client.ws.status === Status.READY) {
      /**
       * Emitted whenever the client joins a server.
       * @event Client#serverCreate
       * @param {Server} server The created server
       */
      client.emit(Events.GUILD_CREATE, server);
    }
  }
};
