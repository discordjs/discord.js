'use strict';

/* eslint-env jest */

const { MockDiscordServer } = require('discord-mock-server');
const MockClient = require('./MockClient');
const { mockApplication } = require('./mockData/mockApplication');
const { mockChannel } = require('./mockData/mockChannel');
const { mockGuild } = require('./mockData/mockGuild');
const { mockInteraction } = require('./mockData/mockInteraction');
const { mockUser } = require('./mockData/mockUser');
const { GatewayIntentBits, Events, GatewayDispatchEvents } = require('../src');

describe('interaction tests', () => {
  let client;
  let server;

  beforeAll(async () => {
    server = new MockDiscordServer({
      gatewayOptions: {
        guilds: [mockGuild()],
        user: mockUser(),
        application: mockApplication(),
      },
    });

    await server.start();
  });

  beforeEach(async () => {
    client = new MockClient(
      {
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        rest: { api: 'http://localhost:3000' },
      },
      server,
    );

    await client.login('fakeToken');
  });

  afterEach(async () => {
    await client.close();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('interaction serialization', () => {
    const fn = jest.fn();
    client.dispatch(GatewayDispatchEvents.InteractionCreate, mockInteraction());
    expect(fn).toHaveBeenCalled();
  });
});
