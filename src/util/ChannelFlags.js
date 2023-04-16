'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link Channel#flags} bitfield.
 * @extends {BitField}
 */
class ChannelFlags extends BitField {}

/**
 * Numeric guild channel flags. All available properties:
 * * `PINNED`
 * * `REQUIRE_TAG`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-flags}
 */
ChannelFlags.FLAGS = {
  PINNED: 1 << 1,
  REQUIRE_TAG: 1 << 4,
};

/**
 * @name ChannelFlags
 * @kind constructor
 * @memberof ChannelFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name ChannelFlags#bitfield
 */

/**
 * Data that can be resolved to give a channel flag bitfield. This can be:
 * * A string (see {@link ChannelFlags.FLAGS})
 * * A channel flag
 * * An instance of ChannelFlags
 * * An Array of ChannelFlags
 * @typedef {string|number|ChannelFlags|ChannelFlagsResolvable[]} ChannelFlagsResolvable
 */

module.exports = ChannelFlags;
