import { createEnum } from './Enums.js';

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
export const Status = createEnum(['Ready', 'Idle', 'WaitingForGuilds']);
