const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link Activity#speaking} bitfield.
 */
class Speaking extends BitField {}

/**
 * Numeric speaking flags. All available properties:
 * * `NONE`
 * * `SPEAKING`
 * * `SOUNDSHARE`
 * @type {Object}
 * @see {@link https://discordapp.com/developers/docs/topics/gateway#activity-object-activity-flags}
 */
Speaking.flags = {
  NONE: 1 << 0,
  SPEAKING: 1 << 1,
  SOUNDSHARE: 1 << 2,
};

module.exports = Speaking;
