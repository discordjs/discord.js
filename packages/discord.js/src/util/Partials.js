'use strict';

const { createEnum } = require('./Enums');

module.exports = createEnum([
  'User',
  'Channel',
  'GuildMember',
  'Message',
  'Reaction',
  'GuildScheduledEvent',
  'ThreadMember',
]);
