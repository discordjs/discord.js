'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link GuildMember#flags} bitfield.
 * @extends {BitField}
 */
class GuildMemberFlags extends BitField {}

/**
 * @name GuildMemberFlags
 * @kind constructor
 * @memberof GuildMemberFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Numeric guild member flags. All available properties:
 * * `DID_REJOIN`
 * * `COMPLETED_ONBOARDING`
 * * `BYPASSES_VERIFICATION`
 * * `STARTED_ONBOARDING`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-flags}
 */
GuildMemberFlags.FLAGS = {
  DID_REJOIN: 1 << 0,
  COMPLETED_ONBOARDING: 1 << 1,
  BYPASSES_VERIFICATION: 1 << 2,
  STARTED_ONBOARDING: 1 << 3,
};

/**
 * Data that can be resolved to give a guild member flag bitfield. This can be:
 * * A string (see {@link GuildMemberFlags.FLAGS})
 * * A guild member flag
 * * An instance of GuildMemberFlags
 * * An Array of GuildMemberFlagsResolvable
 * @typedef {string|number|GuildMemberFlags|GuildMemberFlagsResolvable[]} GuildMemberFlagsResolvable
 */

module.exports = GuildMemberFlags;
