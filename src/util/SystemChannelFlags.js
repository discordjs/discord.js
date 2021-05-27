'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link Guild#systemChannelFlags} bitfield.
 * <info>Note that all event message types are enabled by default,
 * and by setting their corresponding flags you are disabling them</info>
 * @extends {BitField}
 */
class SystemChannelFlags extends BitField {}

/**
 * @name SystemChannelFlags
 * @kind constructor
 * @memberof SystemChannelFlags
 * @param {SystemChannelFlagsResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name SystemChannelFlags#bitfield
 */

/**
 * Data that can be resolved to give a sytem channel flag bitfield. This can be:
 * * A string (see {@link SystemChannelFlags.FLAGS})
 * * A sytem channel flag
 * * An instance of SystemChannelFlags
 * * An Array of SystemChannelFlagsResolvable
 * @typedef {string|number|SystemChannelFlags|SystemChannelFlagsResolvable[]} SystemChannelFlagsResolvable
 */

/**
 * Numeric system channel flags. All available properties:
 * * `SUPPRESS_JOIN_NOTIFICATIONS` (Suppress member join notifications)
 * * `SUPPRESS_PREMIUM_SUBSCRIPTIONS` (Suppress server boost notifications)
 * * `SUPPRESS_GUILD_REMINDER_NOTIFICATIONS` (Suppress server setup tips)
 * @type {Object}
 */
SystemChannelFlags.FLAGS = {
  SUPPRESS_JOIN_NOTIFICATIONS: 1 << 0,
  SUPPRESS_PREMIUM_SUBSCRIPTIONS: 1 << 1,
  SUPPRESS_GUILD_REMINDER_NOTIFICATIONS: 1 << 2,
};

module.exports = SystemChannelFlags;
