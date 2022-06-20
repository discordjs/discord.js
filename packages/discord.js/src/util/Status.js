'use strict';

const { createEnum } = require('./Enums');

/**
 * @typedef {Object} Status
 * @property {number} Ready
 * @property {number} Connecting
 * @property {number} Reconnecting
 * @property {number} Idle
 * @property {number} Nearly
 * @property {number} Disconnected
 * @property {number} WaitingForGuilds
 * @property {number} Identifying
 * @property {number} Resuming
 */

// JSDoc for IntelliSense purposes
/**
 * @type {Status}
 * @ignore
 */
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
