'use strict';
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link User#flags} bitfield.
 * @extends {BitField}
 */
class UserFlags extends BitField {}

/**
 * @name UserFlags
 * @kind constructor
 * @memberof UserFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Numeric user flags. All available properties:
 * * `DISCORD_EMPLOYEE`
 * * `DISCORD_PARTNER`
 * * `HYPESQUAD_EVENTS`
 * * `BUGHUNTER_LEVEL_1`
 * * `HOUSE_BRAVERY`
 * * `HOUSE_BRILLIANCE`
 * * `HOUSE_BALANCE`
 * * `EARLY_SUPPORTER`
 * * `TEAM_USER`
 * * `SYSTEM`
 * * `BUGHUNTER_LEVEL_2`
 * * `VERIFIED_BOT`
 * * `VERIFIED_DEVELOPER`
 * @type {Object}
 * @see {@link https://discordapp.com/developers/docs/resources/user#user-object-user-flags}
 */
UserFlags.FLAGS = {
  DISCORD_EMPLOYEE: 1 << 0,
  DISCORD_PARTNER: 1 << 1,
  HYPESQUAD_EVENTS: 1 << 2,
  BUGHUNTER_LEVEL_1: 1 << 3,
  HOUSE_BRAVERY: 1 << 6,
  HOUSE_BRILLIANCE: 1 << 7,
  HOUSE_BALANCE: 1 << 8,
  EARLY_SUPPORTER: 1 << 9,
  TEAM_USER: 1 << 10,
  SYSTEM: 1 << 12,
  BUGHUNTER_LEVEL_2: 1 << 14,
  VERIFIED_BOT: 1 << 16,
  VERIFIED_DEVELOPER: 1 << 17,
};

module.exports = UserFlags;
