'use strict';

const { setTimeout } = require('node:timers');
const { MockDiscordServer, createDispatchData } = require('discord-mock-server');
const { Client } = require('../src');

const kTimeout = Symbol('timeout');
const wait = time => new Promise(resolve => setTimeout(() => resolve(kTimeout), time));

class MockClient extends Client {
  constructor(options, server) {
    super(options);
    this.server = server ?? new MockDiscordServer({ gatewayOptions: options.gatewayMocks });
    this.eventCountdown = 0;
  }

  startMockServer() {
    return this.server.start();
  }

  async nextEvent(event, timeout = 1000) {
    const eventPromise = new Promise(resolve => {
      this.on(event, resolve);
    });
    const result = await Promise.race([eventPromise, wait(timeout)]);

    if (result === kTimeout) {
      throw new Error(`Event '${event}' failed to be invoked (timeout ${timeout}ms)`);
    }

    return result;
  }

  async close() {
    this.destroy();
  }

  dispatch(event, data) {
    // This.server.gateway.dispatch(event, data);
    this.ws.shards.get(0).onPacket(createDispatchData(event, data));
  }
}

module.exports = MockClient;
