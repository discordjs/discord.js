import { Guild } from './patch.js';
import { Guild as GuildRefactored } from './patch_refactored.js';
import { BranchCoverage } from '../../BranchCoverage.js';

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

// Initialize coverage tracking for both versions
export const bc = new BranchCoverage('guild.js:patch:tests');
bc.setTotal(54);
export const bc_refactored = new BranchCoverage('guild.js:patch_refactored:tests');
bc_refactored.setTotal(1);

// Mock SystemChannelFlagsBitField
class SystemChannelFlagsBitField {
  constructor(flags) {
    this.flags = flags;
  }
  freeze() {
    return this;
  }
}

// Base mock setup for both Guild versions
const createMockSetup = () => ({
  channels: {
    cache: { clear: () => {} },
  },
  roles: {
    cache: { clear: () => {} },
    _add: () => {},
  },
  members: {
    cache: { clear: () => {} },
    _add: () => {},
  },
  presences: {
    _add: () => {},
  },
  stageInstances: {
    cache: { clear: () => {} },
    _add: () => {},
  },
  scheduledEvents: {
    cache: { clear: () => {} },
    _add: () => {},
  },
  voiceStates: {
    cache: { clear: () => {} },
    _add: () => {},
  },
  // Initialize emojis and stickers as arrays
  emojis: [],
  stickers: [],

  client: {
    channels: { _add: () => {} },
    actions: {
      GuildEmojisUpdate: { handle: () => {} },
      GuildStickersUpdate: { handle: () => {} },
    },
  },
});

// mock Guild classes
class MockGuild extends Guild {
  constructor() {
    super();
    const setup = createMockSetup();
    Object.assign(this, setup);

    // Add _add methods to emojis and stickers arrays
    this.emojis._add = emoji => this.emojis.push(emoji);
    this.stickers._add = sticker => this.stickers.push(sticker);

  }
}

class MockGuildRefactored extends GuildRefactored {
  constructor() {
    super();
    const setup = createMockSetup();
    Object.assign(this, setup);

    // Add _add methods to emojis and stickers arrays
    this.emojis._add = emoji => this.emojis.push(emoji);
    this.stickers._add = sticker => this.stickers.push(sticker);

  }
}

// mocking global functions used in patch func
global._transformAPIIncidentsData = data => ({
  invitesDisabledUntil: data.invites_disabled_until ? new Date(data.invites_disabled_until) : null,
  dmsDisabledUntil: data.dms_disabled_until ? new Date(data.dms_disabled_until) : null,
});
global.SystemChannelFlagsBitField = SystemChannelFlagsBitField;

function runTest(name, data) {
  // original
  const guild = new MockGuild();
  const beforeCoverage = bc.coveredBranches.size;
  guild._patch(data);
  console.log(`${GREEN}Original - ${name}: ${bc.coveredBranches.size - beforeCoverage} new branches covered${RESET}`);

  // refactored
  const guildRefactored = new MockGuildRefactored();
  const beforeCoverageRefactored = bc_refactored.coveredBranches.size;
  guildRefactored._patch(data);
  console.log(
    `${BLUE}Refactored - ${name}: ${bc_refactored.coveredBranches.size - beforeCoverageRefactored} new branches covered${RESET}`,
  );

  // Assert that both implementations produce the same result
  for (const key in data) {
    if (key === 'incidents_data') {
      // Special handling for incidents_data due to date transformation
      const originalData = guild.incidentsData;
      const refactoredData = guildRefactored.incidentsData;

      if (originalData && refactoredData) {
        console.assert(
          originalData.invitesDisabledUntil?.getTime() === refactoredData.invitesDisabledUntil?.getTime() &&
            originalData.dmsDisabledUntil?.getTime() === refactoredData.dmsDisabledUntil?.getTime(),
          `${name}: Mismatch in incidents_data`,
        );
      } else {
        console.assert(originalData === refactoredData, `${name}: Mismatch in incidents_data`);
      }
      continue;
    }

    if (key === 'system_channel_flags') {
      // Special handling for SystemChannelFlagsBitField
      console.assert(
        guild.systemChannelFlags?.flags === guildRefactored.systemChannelFlags?.flags,
        `${name}: Mismatch in system_channel_flags`,
      );
      continue;
    }

    if (['channels', 'roles', 'members', 'presences'].includes(key)) {
      // Skip cache-related assertions for these properties
      continue;
    } else if (key === 'stage_instances' || key === 'voice_states' || key === 'emojis' || key === 'stickers') {
      // For array-like properties, compare lengths and contents
      const originalArray = guild[key === 'stage_instances' ? 'stageInstances' : key];
      const refactoredArray = guildRefactored[key === 'stage_instances' ? 'stageInstances' : key];

      console.assert(
        Array.isArray(originalArray) === Array.isArray(refactoredArray),
        `${name}: Type mismatch in ${key}`,
      );

      if (Array.isArray(originalArray) && Array.isArray(refactoredArray)) {
        console.assert(originalArray.length === refactoredArray.length, `${name}: Length mismatch in ${key}`);

        // Compare each item in the arrays
        for (let i = 0; i < originalArray.length; i++) {
          console.assert(
            JSON.stringify(originalArray[i]) === JSON.stringify(refactoredArray[i]),
            `${name}: Content mismatch in ${key} at index ${i}`,
          );
        }
      }
      continue;
    }

    // For boolean values, ensure they're properly converted
    if (typeof data[key] === 'boolean') {
      console.assert(
        Boolean(guild[toCamelCase(key)]) === Boolean(guildRefactored[toCamelCase(key)]),
        `${name}: Mismatch in ${key}`,
      );
      continue;
    }

    // For all other values, direct comparison
    console.assert(guild[toCamelCase(key)] === guildRefactored[toCamelCase(key)], `${name}: Mismatch in ${key}`);
  }
}

// Helper function to convert snake_case to camelCase
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, g => g[1].toUpperCase());

}

const tests = [
  {
    name: 'Basic guild properties',
    data: {
      id: '123456789',
      name: 'Test Guild',
      icon: 'test-icon',
      unavailable: false,
    },
  },
  {
    name: 'Guild availability - unavailable',
    data: {
      id: '123456789',
      unavailable: true,
    },
  },
  {
    name: 'Guild availability - no unavailable field',
    data: {
      id: '123456789',
    },
  },
  {
    name: 'Discovery and member data',
    data: {
      id: '123456789',
      discovery_splash: 'splash-hash',
      member_count: 100,
      large: true,
      premium_progress_bar_enabled: true,
    },
  },
  {
    name: 'Channel and role data',
    data: {
      id: '123456789',
      channels: [
        { id: '1', name: 'general' },
        { id: '2', name: 'announcements' },
      ],
      roles: [
        { id: '1', name: 'admin' },
        { id: '2', name: 'moderator' },
      ],
    },
  },
  {
    name: 'Member and presence data',
    data: {
      id: '123456789',
      members: [{ user: { id: '1', username: 'user1' } }, { user: { id: '2', username: 'user2' } }],
      presences: [{ user: { id: '1' }, status: 'online' }],
    },
  },
  {
    name: 'Guild features and settings',
    data: {
      id: '123456789',
      widget_enabled: true,
      widget_channel_id: '123',
      explicit_content_filter: 1,
      mfa_level: 1,
      joined_at: new Date().toISOString(),
      default_message_notifications: 1,
    },
  },
  {
    name: 'Maximum values and limits',
    data: {
      id: '123456789',
      max_members: 1000,
      max_presences: 100,
      max_video_channel_users: 25,
      max_stage_video_channel_users: 50,
      approximate_member_count: 950,
      approximate_presence_count: 80,
    },
  },
  {
    name: 'Channel IDs and locale',
    data: {
      id: '123456789',
      rules_channel_id: '111',
      public_updates_channel_id: '222',
      preferred_locale: 'en-US',
      safety_alerts_channel_id: '333',
    },
  },
  {
    name: 'Emoji and sticker handling - new',
    data: {
      id: '123456789',
      emojis: [{ id: '1', name: 'smile' }],
      stickers: [{ id: '1', name: 'wave' }],
    },
  },
  {
    name: 'Emoji and sticker handling - existing',
    data: {
      id: '123456789',
      emojis: [{ id: '2', name: 'wink' }],
      stickers: [{ id: '2', name: 'heart' }],
    },
  },
  {
    name: 'Incidents data present',
    data: {
      id: '123456789',
      incidents_data: {
        invites_disabled_until: new Date().toISOString(),
        dms_disabled_until: new Date().toISOString(),
      },
    },
  },
  {
    name: 'Incidents data absent',
    data: {
      id: '123456789',
    },
  },
  {
    name: 'NSFW level settings',
    data: {
      id: '123456789',
      nsfw_level: 2,
      premium_tier: 3,
      system_channel_flags: 1,
      verification_level: 3,
    },
  },
  {
    name: 'Vanity URL and banner',
    data: {
      id: '123456789',
      vanity_url_code: 'discord',
      banner: 'banner-hash',
      splash: 'splash-hash',
      description: 'Guild description',
    },
  },
  {
    name: 'Hub type and features',
    data: {
      id: '123456789',
      hub_type: 1,
      features: ['COMMUNITY', 'WELCOME_SCREEN_ENABLED'],
      premium_subscription_count: 10,
    },
  },
  {
    name: 'Stage instances and voice states',
    data: {
      id: '123456789',
      stage_instances: [{ id: '1', topic: 'Discussion' }],
      voice_states: [{ user_id: '1', channel_id: '1' }],
    },
  },
  {
    name: 'Scheduled events',
    data: {
      id: '123456789',
      guild_scheduled_events: [{ id: '1', name: 'Community Meeting' }],
    },
  },
];

console.log('Running Guild._patch coverage tests...\n');
tests.forEach(test => runTest(test.name, test.data));
console.log('\n');
console.log(`${GREEN}Original version coverage:${RESET}`);
bc.report();
console.log(`${BLUE}Refactored version coverage:${RESET}`);
bc_refactored.report();
