'use strict';

const { createEnum } = require('./Enums');

module.exports = createEnum([
  'Dispatch',
  'Heartbeat',
  'Identify',
  'StatusUpdate',
  'VoiceStateUpdate',
  'VoiceGuildPing',
  'Resume',
  'Reconnect',
  'RequestGuildMembers',
  'InvalidSession',
  'Hello',
  'HeartbeatAck',
]);
