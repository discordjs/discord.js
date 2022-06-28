'use strict';

/**
 * @typedef {Object} ShardEvents
 * @property {string} Death death
 * @property {string} Disconnect disconnect
 * @property {string} Error error
 * @property {string} Message message
 * @property {string} Ready ready
 * @property {string} Reconnecting reconnecting
 * @property {string} Spawn spawn
 */

// JSDoc for IntelliSense purposes
/**
 * @type {ShardEvents}
 * @ignore
 */
module.exports = {
  Death: 'death',
  Disconnect: 'disconnect',
  Error: 'error',
  Message: 'message',
  Ready: 'ready',
  Reconnecting: 'reconnecting',
  Spawn: 'spawn',
};
