'use strict';

const { ApplicationFlags } = require('discord-api-types/v10');

module.exports.mockApplication = mergeData => ({
  id: '1234562345232',
  name: 'MockApplication',
  icon: null,
  description: 'A mock application',
  bot_public: true,
  flags: ApplicationFlags.GatewayGuildMembers,
  bot_require_code_grant: false,
  verify_key: '',
  summary: '',
  team: null,
  ...mergeData,
});
