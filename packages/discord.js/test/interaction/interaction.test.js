/* eslint-disable max-nested-callbacks */
'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Interaction, InteractionType } = require('../../src');
const MockClient = require('../MockClient');
const { mockApplication } = require('../mockData/mockApplication');
const { mockChannel } = require('../mockData/mockChannel');
const { mockGuild } = require('../mockData/mockGuild');
const { mockInteraction } = require('../mockData/mockInteraction');
const { mockMember } = require('../mockData/mockMember');
const { mockUser } = require('../mockData/mockUser');

/* eslint-env jest */

describe('interaction structure tests', () => {
  let client;

  beforeEach(() => {
    client = new MockClient({ intents: [] });

    // Add basic channels
    client.channels._add(mockChannel());

    // Add basic guild
    client.guilds._add(mockGuild());

    // Add basic user
    client.users._add(mockUser());
  });

  afterEach(async () => {
    await client.close();
    await client.server.stop();
  });

  describe('Interaction', () => {
    describe('Interaction fields', () => {
      let interaction;

      beforeEach(() => {
        interaction = new Interaction(
          client,
          mockInteraction({
            locale: 'en-US',
            channel_id: mockChannel().id,
            guild_id: mockGuild().id,
            user: mockUser(),
            member: mockMember(),
          }),
        );
      });

      test('construction', () => {
        expect(interaction).toBeInstanceOf(Interaction);
        expect(interaction.type).toBe(InteractionType.ApplicationCommand);
        expect(interaction.applicationId).toBe(mockApplication().id);
        expect(interaction.channelId).toBe(mockChannel().id);
        expect(interaction.guildId).toBe(mockGuild().id);
        expect(interaction.version).toBe(10);
        expect(interaction.locale).toBe('en-US');
        expect(interaction.guildLocale).toBe(null);
      });

      test('getters', () => {
        // Check computed fields
        const user = client.users.cache.get(mockUser().id);
        const guild = client.guilds.cache.get(mockGuild().id);
        const member = guild.members.cache.get(mockMember().user.id);
        const channel = client.channels.cache.get(mockChannel().id);

        expect(interaction.user).toBe(user);
        expect(interaction.guild).toBe(guild);
        expect(interaction.member).toBe(member);
        expect(interaction.channel).toBe(channel);
        expect(interaction.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(mockInteraction().id));
        expect(interaction.createdAt).toEqual(new Date(interaction.createdTimestamp));
      });

      describe('methods', () => {
        test('guild methods', () => {
          const guildlessInteraction = new Interaction(client, mockInteraction());
          expect(guildlessInteraction.inGuild()).toBe(false);
          expect(guildlessInteraction.inCachedGuild()).toBe(false);
          expect(guildlessInteraction.inRawGuild()).toBe(false);

          const guildInteraction = new Interaction(
            client,
            mockInteraction({
              guild_id: mockGuild().id,
              member: mockMember(),
            }),
          );

          expect(guildInteraction.inGuild()).toBe(true);
          expect(guildInteraction.inCachedGuild()).toBe(true);
          expect(guildInteraction.inRawGuild()).toBe(false);
        });
      });
    });
  });
});
