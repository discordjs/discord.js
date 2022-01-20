'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link Message#flags} bitfield.
 * @extends {BitField}
 */
class MessageFlagsBitField extends BitField {}

/**
 * @name MessageFlagsBitfield
 * @kind constructor
 * @memberof MessageFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name MessageFlagsBitfield#bitfield
 */

module.exports = MessageFlagsBitField;
