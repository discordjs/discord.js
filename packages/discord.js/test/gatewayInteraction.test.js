'use strict';

/* eslint-env jest */

const { MockDiscordServer } = require('discord-mock-server');
const MockClient = require('./MockClient');
const { mockApplication } = require('./mockData/mockApplication');
const { mockGuild } = require('./mockData/mockGuild');
const {
  mockInteraction,
  mockButtonComponentData,
  mockSelectMenuComponentData,
  mockModalSubmitData,
  mockTextInputData,
  mockActionRowData,
  mockApplicationCommandData,
  mockContextMenuCommandData,
  mockAutocompleteData,
} = require('./mockData/mockInteraction');
const { mockMessage } = require('./mockData/mockMessage');
const { mockUser } = require('./mockData/mockUser');
const {
  GatewayIntentBits,
  Events,
  GatewayDispatchEvents,
  InteractionType,
  ButtonInteraction,
  SelectMenuInteraction,
  ModalSubmitInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  AutocompleteInteraction,
} = require('../src');
describe('interaction tests', () => {
  jest.setTimeout(10000);
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

  test('Emits interaction event given valid interaction data', () => {
    const listener = jest.fn();
    client.on(Events.InteractionCreate, listener);
    client.dispatch(GatewayDispatchEvents.InteractionCreate, mockInteraction());
    expect(listener).toHaveBeenCalled();
  });

  test("interaction event doesn't emit on invalid interaction data", () => {
    const listener = jest.fn();
    client.on(Events.InteractionCreate, listener);
    client.dispatch(GatewayDispatchEvents.InteractionCreate, { type: 42 });
    expect(listener).not.toHaveBeenCalled();
  });

  describe('interaction serialization', () => {
    const listener = jest.fn();

    beforeEach(() => {
      client.on(Events.InteractionCreate, listener);
    });

    afterEach(() => {
      listener.mockClear();
    });

    describe('application command interaction serialization', () => {
      test('ChatInputCommandInteraction', () => {
        const data = mockApplicationCommandData();
        client.dispatch(
          GatewayDispatchEvents.InteractionCreate,
          mockInteraction({
            type: InteractionType.ApplicationCommand,
            data,
          }),
        );
        const [[interaction]] = listener.mock.calls;
        expect(interaction).toBeInstanceOf(ChatInputCommandInteraction);
      });

      test('MessageContextMenuInteraction', () => {
        const data = mockContextMenuCommandData({
          resolved: {
            123456789: mockMessage(),
          },
        });
        client.dispatch(
          GatewayDispatchEvents.InteractionCreate,
          mockInteraction({
            type: InteractionType.ApplicationCommand,
            data,
          }),
        );
        const [[interaction]] = listener.mock.calls;
        expect(interaction).toBeInstanceOf(MessageContextMenuCommandInteraction);
      });

      test('UserContextMenuInteraction', () => {
        const data = mockContextMenuCommandData({
          type: ApplicationCommandType.User,
          resolved: {
            123456789: mockUser(),
          },
        });
        client.dispatch(
          GatewayDispatchEvents.InteractionCreate,
          mockInteraction({
            type: InteractionType.ApplicationCommand,
            data,
          }),
        );
        const [[interaction]] = listener.mock.calls;
        expect(interaction).toBeInstanceOf(UserContextMenuCommandInteraction);
      });

      test('unknown application command type', () => {
        const data = mockContextMenuCommandData({
          type: 42,
        });
        client.dispatch(
          GatewayDispatchEvents.InteractionCreate,
          mockInteraction({
            type: InteractionType.ApplicationCommand,
            data,
          }),
        );
        expect(listener).not.toHaveBeenCalled();
      });
    });

    describe('component interaction serialization', () => {
      test('ButtonInteraction', () => {
        const data = mockButtonComponentData();

        client.dispatch(
          GatewayDispatchEvents.InteractionCreate,
          mockInteraction({
            type: InteractionType.MessageComponent,
            data,
          }),
        );
        const [[interaction]] = listener.mock.calls;
        expect(interaction).toBeInstanceOf(ButtonInteraction);
      });

      test('SelectMenuInteraction', () => {
        const data = mockSelectMenuComponentData();
        client.dispatch(
          GatewayDispatchEvents.InteractionCreate,
          mockInteraction({
            type: InteractionType.MessageComponent,
            data: data,
          }),
        );
        const [[interaction]] = listener.mock.calls;
        expect(interaction).toBeInstanceOf(SelectMenuInteraction);
      });

      test('unknown component type', () => {
        const data = mockSelectMenuComponentData({
          component_type: 42,
        });
        client.dispatch(
          GatewayDispatchEvents.InteractionCreate,
          mockInteraction({
            type: InteractionType.MessageComponent,
            data: data,
          }),
        );
        expect(listener).not.toHaveBeenCalled();
      });
    });

    describe('autocomplete interaction serialization', () => {
      test('AutocompleteInteraction', () => {
        const data = mockAutocompleteData();
        client.dispatch(
          GatewayDispatchEvents.InteractionCreate,
          mockInteraction({
            type: InteractionType.ApplicationCommandAutocomplete,
            data,
          }),
        );
        const [[interaction]] = listener.mock.calls;
        expect(interaction).toBeInstanceOf(AutocompleteInteraction);
      });
    });

    describe('modal submit component serialization', () => {
      // TODO: reinstate when PR fix for serialization arrives
      test.skip('ModalSubmitInteraction', () => {
        const data = mockModalSubmitData({
          components: [
            mockActionRowData({
              components: [mockTextInputData()],
            }),
          ],
        });
        client.dispatch(
          GatewayDispatchEvents.InteractionCreate,
          mockInteraction({
            type: InteractionType.ModalSubmit,
            data,
          }),
        );
        const [[interaction]] = listener.mock.calls;
        expect(interaction).toBeInstanceOf(ModalSubmitInteraction);
      });
    });
  });
});
