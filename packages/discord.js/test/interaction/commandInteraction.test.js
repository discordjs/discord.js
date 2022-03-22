/* eslint-disable max-nested-callbacks */
'use strict';

const {
  CommandInteraction,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommand,
  ClientApplication,
} = require('../../src');
const MockClient = require('../MockClient');
const { mockApplication } = require('../mockData/mockApplication');
const { mockChannel } = require('../mockData/mockChannel');
const { mockGuild } = require('../mockData/mockGuild');
const { mockInteraction, mockApplicationCommandData } = require('../mockData/mockInteraction');
const { mockUser } = require('../mockData/mockUser');

/* eslint-env jest */

describe('command interaction tests', () => {
  let client;

  beforeAll(() => {
    client = new MockClient({ intents: [] });

    // Add basic channels
    client.channels._add(mockChannel());

    // Add basic guild
    client.guilds._add(mockGuild());

    // Add basic user
    client.users._add(mockUser());

    // Add application
    client.application = new ClientApplication(client, mockApplication());
  });

  afterEach(() => {
    client.application.commands.cache.clear();
  });

  afterAll(async () => {
    await client.close();
    await client.server.stop();
  });

  test('constructor', () => {
    const commandInteraction = new CommandInteraction(client, mockInteraction());

    expect(commandInteraction.commandId).toBe(mockInteraction().data.id);
    expect(commandInteraction.commandName).toBe(mockInteraction().data.name);
    expect(commandInteraction.commandType).toBe(mockInteraction().data.type);
    expect(commandInteraction.deferred).toBe(false);
    expect(commandInteraction.replied).toBe(false);
    expect(commandInteraction.ephemeral).toBe(null);
  });

  describe('chat input commands', () => {
    test('getters', () => {
      const chatInputCommandInteraction = new ChatInputCommandInteraction(client, mockInteraction());

      // Add dummy command
      client.application.commands.cache.set(
        mockInteraction().data.id,
        new ApplicationCommand(client, mockInteraction().data),
      );

      expect(chatInputCommandInteraction.command).toBeInstanceOf(ApplicationCommand);
    });

    test('type guards', () => {
      const chatInputCommandInteraction = new ChatInputCommandInteraction(client, mockInteraction());

      expect(chatInputCommandInteraction.isCommand()).toBe(true);
      expect(chatInputCommandInteraction.isChatInputCommand()).toBe(true);
      expect(chatInputCommandInteraction.isContextMenuCommand()).toBe(false);
    });

    describe('option transformation', () => {
      const data = mockApplicationCommandData({
        options: [
          {
            name: 'option1',
            value: 'foobar',
            type: ApplicationCommandOptionType.String,
          },
          {
            name: 'option2',
            type: ApplicationCommandOptionType.User,
            value: mockUser().id,
          },
        ],
        resolved: {
          users: {
            [mockUser().id]: mockUser(),
          },
        },
      });

      let chatInputCommandInteraction;

      beforeAll(() => {
        chatInputCommandInteraction = new ChatInputCommandInteraction(
          client,
          mockInteraction({
            data,
          }),
        );
      });

      test('transformOption', () => {
        const transformed = data.options.map(option =>
          chatInputCommandInteraction.transformOption(option, data.resolved),
        );

        expect(transformed).toEqual([
          { name: 'option1', type: 3, value: 'foobar' },
          {
            name: 'option2',
            type: ApplicationCommandOptionType.User,
            value: mockUser().id,
            user: client.users.cache.get(mockUser().id),
          },
        ]);
      });

      test('transformResolved', () => {
        const transformed = chatInputCommandInteraction.transformResolved(data.resolved ?? {});
        expect(transformed.users.get(mockUser().id)).toBe(client.users.cache.get(mockUser().id));
      });
    });
  });
});
