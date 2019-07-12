'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link Activity#flags} bitfield.
 * @extends {BitField}
 */
class ActivityFlags extends BitField {}

/**
 * Numeric activity flags. All available properties:
 * * `INSTANCE`
 * * `JOIN`
 * * `SPECTATE`
 * * `JOIN_REQUEST`
 * * `SYNC`
 * * `PLAY`
 * @type {Object}
 * @see {@link https://discordapp.com/developers/docs/topics/gateway#activity-object-activity-flags}
 */
ActivityFlags.FLAGS = {
  INSTANCE: 1 << 0,
  JOIN: 1 << 1,
  SPECTATE: 1 << 2,
  JOIN_REQUEST: 1 << 3,
  SYNC: 1 << 4,
  PLAY: 1 << 5,
};

module.exports = ActivityFlags;
