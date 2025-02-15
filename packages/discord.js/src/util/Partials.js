'use strict';

const { createEnum } = require('./Enums');

/**
 * The enumeration for partials.
 * ```js
 * import { Client, Partials } from 'discord.js';
 *
 * const client = new Client({
 *   intents: [
 *     // Intents...
 *   ],
 *   partials: [
 *     Partials.User, // We want to receive uncached users!
 *     Partials.Message // We want to receive uncached messages!
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
 * @property {number} SoundboardSound The partial to receive uncached soundboard sounds.
 * @property {number} Poll The partial to receive uncached polls.
 * @property {number} PollAnswer The partial to receive uncached poll answers.
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
  'SoundboardSound',
  'Poll',
  'PollAnswer',
]);
