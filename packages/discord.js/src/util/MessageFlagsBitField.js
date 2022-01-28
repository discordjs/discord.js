'use strict';

const { MessageFlags } = require('discord-api-types/v9');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link Message#flags} bitfield.
 * @extends {BitField}
 */
class MessageFlagsBitField extends BitField {}

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

/**
 * Numeric message flags.
 * @type {MessageFlags}
 */
MessageFlagsBitField.Flags = MessageFlags;

module.exports = MessageFlagsBitField;
