'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link GuildMember#flags} bitfield.
 * @extends {BitField}
 */
class RoleFlags extends BitField {}

/**
 * @name RoleFlags
 * @kind constructor
 * @memberof RoleFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Numeric guild member flags. All available properties:
 * * `IN_PROMPT`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/topics/permissions#role-object-role-flags}
 */
RoleFlags.FLAGS = {
  IN_PROMPT: 1 << 0,
};

/**
 * Data that can be resolved to give a role flag bitfield. This can be:
 * * A string (see {@link RoleFlags.FLAGS})
 * * A role flag
 * * An instance of RoleFlags
 * * An Array of RoleFlagsResolvable
 * @typedef {string|number|RoleFlags|RoleFlagsResolvable[]} RoleFlagsResolvable
 */

module.exports = RoleFlags;
