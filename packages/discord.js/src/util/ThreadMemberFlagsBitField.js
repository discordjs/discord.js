'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link ThreadMember#flags} bitfield.
 * @extends {BitField}
 */
class ThreadMemberFlagsBitField extends BitField {}

/**
 * @name ThreadMemberFlagsBitField
 * @kind constructor
 * @memberof ThreadMemberFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name ThreadMemberFlagsBitField#bitfield
 */

/**
 * Numeric thread member flags. There are currently no bitflags relevant to bots for this.
 * @type {Object<string, number>}
 */
ThreadMemberFlagsBitField.Flags = {};

module.exports = ThreadMemberFlagsBitField;
