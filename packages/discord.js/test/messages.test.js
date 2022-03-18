/* eslint-disable no-restricted-globals */
'use strict';

/* eslint-env jest */

const { MockDiscordServer } = require('discord-mock-server');
const MockClient = require('./MockClient');
const { mockApplication } = require('./mockData/mockApplication');
const { mockChannel } = require('./mockData/mockChannel');
const { mockGuild } = require('./mockData/mockGuild');
const { mockMessage } = require('./mockData/mockMessage');
const { mockUser } = require('./mockData/mockUser');
const { GatewayIntentBits, ChannelType, Events, GatewayDispatchEvents } = require('../src');
describe('message test', () => {
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

  test('client properly serializes message', () => {
    // Send a fake message
    const fn = jest.fn();
    client.on(Events.MessageCreate, fn);
    client.dispatch(GatewayDispatchEvents.MessageCreate, mockMessage());
    expect(fn).toHaveBeenCalled();
  });

  test("client doesn't emit message event given invalid message data", () => {
    const fn = jest.fn();
    client.on(Events.MessageCreate, fn);
    client.dispatch(GatewayDispatchEvents.MessageCreate, {});
    expect(fn).not.toHaveBeenCalled();
  });

  test("client doesn't emit message event given invalid message channel", () => {
    const fn = jest.fn();

    client.on(Events.MessageCreate, fn);

    // Create a voice channel
    client.dispatch(GatewayDispatchEvents.ChannelCreate, {
      ...mockChannel,
      id: '173492343',
      type: ChannelType.GuildVoice,
      guild_id: mockGuild.id,
    });

    client.dispatch(GatewayDispatchEvents.MessageCreate, mockMessage({ channel_id: '173492343' }));
    expect(fn).not.toHaveBeenCalled();
  });

  test("client doesn't emit message event given existing message", () => {
    const fn = jest.fn();
    client.dispatch(GatewayDispatchEvents.MessageCreate, mockMessage());

    client.on(Events.MessageCreate, fn);

    client.dispatch(GatewayDispatchEvents.MessageCreate, mockMessage());
    expect(fn).not.toHaveBeenCalled();
  });

  test('receivedMessage properly gets channel', () => {
    const fn = jest.fn();

    client.on(Events.MessageCreate, fn);
    client.dispatch(GatewayDispatchEvents.MessageCreate, mockMessage());
    const [[message]] = fn.mock.calls;
    expect(message.channel.name).toBe(mockChannel().name);
  });
});
