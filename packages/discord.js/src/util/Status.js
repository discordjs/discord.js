'use strict';

const { createEnum } = require('./Enums.js');

/**
 * @typedef {Object} Status
 * @property {number} Ready ready
 * @property {number} Idle idle
 * @property {number} WaitingForGuilds waiting for guilds
 */

// JSDoc for IntelliSense purposes
/**
 * @type {Status}
 * @ignore
 */
exports.Status = createEnum(['Ready', 'Idle', 'WaitingForGuilds']);
