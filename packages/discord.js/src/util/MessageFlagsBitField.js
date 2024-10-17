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
 * Data that can be resolved to give a message flags bit field. This can be:
 * * A string (see {@link MessageFlagsBitField.Flags})
 * * A message flag
 * * An instance of {@link MessageFlagsBitField}
 * * An array of `MessageFlagsResolvable`
 * @typedef {string|number|MessageFlagsBitField|MessageFlagsResolvable[]} MessageFlagsResolvable
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name MessageFlagsBitField#bitfield
 */

module.exports = MessageFlagsBitField;
