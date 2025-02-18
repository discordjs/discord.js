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
  channels: { cache: { clear: () => {} } },
  roles: { cache: { clear: () => {} }, _add: () => {} },
  members: { cache: { clear: () => {} }, _add: () => {} },
  presences: { _add: () => {} },
  stageInstances: { cache: { clear: () => {} }, _add: () => {} },
  scheduledEvents: { cache: { clear: () => {} }, _add: () => {} },
  voiceStates: { cache: { clear: () => {} }, _add: () => {} },
  emojis: { _add: () => {} },
  stickers: { _add: () => {} },
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
    Object.assign(this, createMockSetup());
  }
}

class MockGuildRefactored extends GuildRefactored {
  constructor() {
    super();
    Object.assign(this, createMockSetup());
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
