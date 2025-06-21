'use strict';

const { Client, GatewayIntentBits } = require('../src/index.js');

// Mock data based on actual API response (personal information anonymized)
const mockUserDataWithGuildtag = {
  id: '1234567890123456789',
  username: 'testuser',
  avatar: null,
  discriminator: '0',
  public_flags: 128,
  flags: 128,
  banner: null,
  accent_color: null,
  global_name: 'Test User',
  avatar_decoration_data: null,
  collectibles: null,
  banner_color: null,
  clan: {
    identity_guild_id: '9876543210987654321',
    identity_enabled: true,
    tag: 'TEST',
    badge: 'abcdef1234567890abcdef1234567890',
  },
  primary_guild: {
    identity_guild_id: '9876543210987654321',
    identity_enabled: true,
    tag: 'TEST',
    badge: 'abcdef1234567890abcdef1234567890',
  },
};

const mockUserDataWithoutGuildtag = {
  id: '123456789012345678',
  username: 'testuser',
  discriminator: '1234',
  avatar: 'test_avatar_hash',
  bot: false,
  system: false,
  public_flags: 0,
  // primary_guild is not present
};

describe('User guildtag property tests', () => {
  let client;
  let user;

  beforeEach(() => {
    client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
    });

    const { User } = require('../src/structures/User.js');
    user = new User(client, mockUserDataWithGuildtag);
  });

  afterEach(() => {
    if (client) {
      client.destroy();
    }
  });

  test('should have guildtag property when provided in data', () => {
    expect(user.guildtag).toBe('TEST');
  });

  test('should set guildtag to null when not provided in data', () => {
    const userWithoutGuildtag = new (require('../src/structures/User.js').User)(client, mockUserDataWithoutGuildtag);
    expect(userWithoutGuildtag.guildtag).toBeNull();
  });

  test('should update guildtag when _patch is called with new data', () => {
    const newData = {
      ...mockUserDataWithGuildtag,
      primary_guild: { ...mockUserDataWithGuildtag.primary_guild, tag: 'NewGuildTag' },
    };
    user._patch(newData);
    expect(user.guildtag).toBe('NewGuildTag');
  });

  test('should handle guildtag in equals method', () => {
    const { User } = require('../src/structures/User.js');
    const user1 = new User(client, mockUserDataWithGuildtag);
    const user2 = new User(client, {
      ...mockUserDataWithGuildtag,
      primary_guild: { ...mockUserDataWithGuildtag.primary_guild, tag: 'DifferentGuildTag' },
    });

    expect(user1.equals(user2)).toBe(false);

    const user3 = new User(client, mockUserDataWithGuildtag);
    expect(user1.equals(user3)).toBe(true);
  });

  test('should handle guildtag in _equals method', () => {
    const apiUserData = {
      id: '1234567890123456789',
      username: 'testuser',
      discriminator: '0',
      avatar: 'test_avatar_hash',
      public_flags: 128,
      primary_guild: {
        identity_guild_id: '9876543210987654321',
        identity_enabled: true,
        tag: 'TEST',
        badge: 'abcdef1234567890abcdef1234567890',
      },
    };

    expect(user._equals(apiUserData)).toBe(true);

    const differentApiData = {
      ...apiUserData,
      primary_guild: { ...apiUserData.primary_guild, tag: 'DifferentGuildTag' },
    };
    expect(user._equals(differentApiData)).toBe(false);
  });

  test('should include guildtag in toJSON output', () => {
    const json = user.toJSON();
    expect(json.guildtag).toBe('TEST');
  });

  test('should handle guildtag in cache operations', () => {
    client.users.cache.set(user.id, user);
    const cachedUser = client.users.cache.get(user.id);
    expect(cachedUser.guildtag).toBe('TEST');
  });

  test('should handle partial user data', () => {
    const partialData = { id: '123456789012345678' };
    const partialUser = new (require('../src/structures/User.js').User)(client, partialData);

    expect(partialUser.partial).toBe(true);
    expect(partialUser.guildtag).toBeNull();
  });
});
