'use strict';

/**
 * @typedef {Object} WebSocketShardEvents
 * @property {string} Close close
 * @property {string} Destroyed destroyed
 * @property {string} InvalidSession invalidSession
 * @property {string} Ready ready
 * @property {string} Resumed resumed
 * @property {string} AllReady allReady
 */

// JSDoc for IntelliSense purposes
/**
 * @type {WebSocketShardEvents}
 * @ignore
 */
module.exports = {
  Close: 'close',
  Destroyed: 'destroyed',
  InvalidSession: 'invalidSession',
  Ready: 'ready',
  Resumed: 'resumed',
  AllReady: 'allReady',
};
