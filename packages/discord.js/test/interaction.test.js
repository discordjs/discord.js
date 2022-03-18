'use strict';

/* eslint-env jest */

const { MockDiscordServer } = require('discord-mock-server');
const MockClient = require('./MockClient');
const { mockApplication } = require('./mockData/mockApplication');
const { mockGuild } = require('./mockData/mockGuild');
const { mockInteraction, mockButtonComponentData, mockSelectMenuComponentData } = require('./mockData/mockInteraction');
const { mockUser } = require('./mockData/mockUser');
const {
  GatewayIntentBits,
  Events,
  GatewayDispatchEvents,
  CommandInteraction,
  InteractionType,
  ButtonInteraction,
  SelectMenuInteraction,
  ComponentType,
} = require('../src');

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

  test('Emit event serialization given valid application command data', () => {
    const fn = jest.fn();
    client.on(Events.InteractionCreate, fn);
    client.dispatch(GatewayDispatchEvents.InteractionCreate, mockInteraction());
    const [[interaction]] = fn.mock.calls;
    expect(interaction).toBeInstanceOf(CommandInteraction);
  });

  test('interaction event fires', () => {
    const fn = jest.fn();
    client.on(Events.InteractionCreate, fn);
    client.dispatch(GatewayDispatchEvents.InteractionCreate, mockInteraction());
    // Console.log(fn.mock.calls);
    expect(fn).toHaveBeenCalled();
  });

  describe('interaction serialization', () => {
    const fn = jest.fn();

    beforeEach(() => {
      client.on(Events.InteractionCreate, fn);
    });

    afterEach(() => {
      fn.mockClear();
    });

    test('ButtonInteraction is properly serialized given valid button interaction data', () => {
      const data = mockButtonComponentData();

      client.dispatch(
        GatewayDispatchEvents.InteractionCreate,
        mockInteraction({
          type: InteractionType.MessageComponent,
          data,
        }),
      );
      const [[interaction]] = fn.mock.calls;
      expect(interaction).toBeInstanceOf(ButtonInteraction);
      expect(interaction.customId).toEqual(data.custom_id);
      expect(interaction.componentType).toEqual(data.component_type);
    });

    test('SelectMenuInteraction is properly serialized given valid select menu interaction data', () => {
      const data = mockSelectMenuComponentData();
      client.dispatch(
        GatewayDispatchEvents.InteractionCreate,
        mockInteraction({
          type: InteractionType.MessageComponent,
          data: data,
        }),
      );
      const [[interaction]] = fn.mock.calls;
      expect(interaction).toBeInstanceOf(SelectMenuInteraction);
      expect(interaction.customId).toEqual(data.custom_id);
      expect(interaction.componentType).toEqual(ComponentType.SelectMenu);
      expect(interaction.values).toEqual(data.values);
    });
  });
});
