'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ServerIntegrationsUpdate extends Action {
  handle(data) {
    const client = this.client;
    const server = client.servers.cache.get(data.server_id);
    /**
     * Emitted whenever a server integration is updated
     * @event Client#serverIntegrationsUpdate
     * @param {Server} server The server whose integrations were updated
     */
    if (server) client.emit(Events.GUILD_INTEGRATIONS_UPDATE, server);
  }
}

module.exports = ServerIntegrationsUpdate;
