'use strict';

const { createEnum } = require('./Enums');

module.exports = createEnum([
  'Ready',
  'Connecting',
  'Reconnecting',
  'Idle',
  'Nearly',
  'Disconnected',
  'WaitingForGuilds',
  'Identifying',
  'Resuming',
]);
