'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link ThreadMember#flags} bitfield.
 * @extends {BitField}
 */
class ThreadMemberFlags extends BitField {}

/**
 * @name ThreadMemberFlags
 * @kind constructor
 * @memberof ThreadMemberFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name ThreadMemberFlags#bitfield
 */

/**
 * Numeric thread member flags. All available properties:
 * @type {Object}
 */
ThreadMemberFlags.FLAGS = {};

module.exports = ThreadMemberFlags;
