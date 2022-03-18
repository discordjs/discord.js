'use strict';

const { MockDiscordServer, createDispatchData } = require('discord-mock-server');
const { Client } = require('../src');

class MockClient extends Client {
  constructor(options, server) {
    super(options);
    this.server = server ?? new MockDiscordServer({ gatewayOptions: options.gatewayMocks });
  }

  startMockServer() {
    return this.server.start();
  }
  close() {
    this.destroy();
  }

  async login(token, awaitGuilds = true) {
    if (awaitGuilds) {
      await Promise.all([new Promise(resolve => this.on('ready', resolve)), super.login(token)]);
      return;
    }

    await super.login(token);
  }

  dispatch(event, data) {
    // This.server.gateway.dispatch(event, data);
    this.ws.shards.get(0).onPacket(createDispatchData(event, data));
  }
}

module.exports = MockClient;
