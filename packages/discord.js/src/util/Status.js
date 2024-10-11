'use strict';

const { createEnum } = require('./Enums');

/**
 * @typedef {Object} Status
 * @property {number} Ready
 * @property {number} Idle
 * @property {number} WaitingForGuilds
 */

// JSDoc for IntelliSense purposes
/**
 * @type {Status}
 * @ignore
 */
module.exports = createEnum(['Ready', 'Idle', 'WaitingForGuilds']);
