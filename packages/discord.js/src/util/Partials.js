'use strict';

const BitField = require('./BitField');
const { createEnum } = require('./Enums');

/**
 * Data structure that makes it easy to calculate partials.
 * @extends {BitField}
 */
class Partials extends BitField {
  /**
   * Numeric partial flags. All available properties:
   * * `User`
   * * `Channel`
   * * `GuildMember`
   * * `Message`
   * * `Reaction`
   * * `GuildScheduledEvent`
   * @typedef {Object} PartialsFlags
   */

  /**
   * Numeric partial flags
   * @type {PartialsFlags}
   */
  static Flags = createEnum([
    'User',
    'Channel',
    'GuildMember',
    'Message',
    'Reaction',
    'GuildScheduledEvent',
    'ThreadMember',
  ]);

  /**
   * All of the existing partial flags
   * @type {number[]}
   */
  static All = Object.keys(Partials.Flags)
    .map(Number)
    .filter(p => !isNaN(p));
}

module.exports = Partials;
