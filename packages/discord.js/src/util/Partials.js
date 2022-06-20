'use strict';

const { createEnum } = require('./Enums');

/**
 * The enumeration for partials.
 * ```js
 * const { Client, Partials } = require('discord.js');
 *
 * const client = new Client({
 *   intents: [
 *     // Intents...
 *   ],
 *   partials: [
 *     Partials.User, // We need to receive uncached users!
 *     Partials.Message // We need to receive uncached messages!
 *   ]
 * });
 * ```
 * @typedef {Object} Partials
 * @property {number} User The partial to receive uncached users.
 * @property {number} Channel The partial to receive uncached channels.
 * <info>This is required to receive direct messages!</info>
 * @property {number} GuildMember The partial to receive uncached guild members.
 * @property {number} Message The partial to receive uncached messages.
 * @property {number} Reaction The partial to receive uncached reactions.
 * @property {number} GuildScheduledEvent The partial to receive uncached guild scheduled events.
 * @property {number} ThreadMember The partial to receive uncached thread members.
 */

// JSDoc for IntelliSense purposes
/**
 * @type {Partials}
 * @ignore
 */
module.exports = createEnum([
  'User',
  'Channel',
  'GuildMember',
  'Message',
  'Reaction',
  'GuildScheduledEvent',
  'ThreadMember',
]);
