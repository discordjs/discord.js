'use strict';

const { MessageFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link Message#flags} bitfield.
 * @extends {BitField}
 */
class MessageFlagsBitField extends BitField {
  /**
   * Numeric message flags.
   * @type {MessageFlags}
   * @memberof MessageFlagsBitField
   */
  static Flags = MessageFlags;
}

/**
 * @name MessageFlagsBitField
 * @kind constructor
 * @memberof MessageFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name MessageFlagsBitField#bitfield
 */

module.exports = MessageFlagsBitField;
