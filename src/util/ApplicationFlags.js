'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link ClientApplication#flags} bitfield.
 * @extends {BitField}
 */
class ApplicationFlags extends BitField {}

/**
 * @name ApplicationFlags
 * @kind constructor
 * @memberof ApplicationFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name ApplicationFlags#bitfield
 */

/**
 * Numeric application flags. All available properties:
 * * `MANAGED_EMOJI`
 * * `GROUP_DM_CREATE`
 * * `RPC_HAS_CONNECTED`
 * * `GATEWAY_PRESENCE`
 * * `FATEWAY_PRESENCE_LIMITED`
 * * `GATEWAY_GUILD_MEMBERS`
 * * `GATEWAY_GUILD_MEMBERS_LIMITED`
 * * `VERIFICATION_PENDING_GUILD_LIMIT`
 * * `EMBEDDED`
 * @type {Object}
 */
ApplicationFlags.FLAGS = {
  MANAGED_EMOJI: 1 << 2,
  GROUP_DM_CREATE: 1 << 4,
  RPC_HAS_CONNECTED: 1 << 11,
  GATEWAY_PRESENCE: 1 << 12,
  GATEWAY_PRESENCE_LIMITED: 1 << 13,
  GATEWAY_GUILD_MEMBERS: 1 << 14,
  GATEWAY_GUILD_MEMBERS_LIMITED: 1 << 15,
  VERIFICATION_PENDING_GUILD_LIMIT: 1 << 16,
  EMBEDDED: 1 << 17,
};

module.exports = ApplicationFlags;
