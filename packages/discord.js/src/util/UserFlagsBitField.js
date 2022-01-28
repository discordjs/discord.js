'use strict';

const { UserFlags } = require('discord-api-types/v9');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link User#flags} bitfield.
 * @extends {BitField}
 */
class UserFlagsBitField extends BitField {}

/**
 * @name UserFlagsBitField
 * @kind constructor
 * @memberof UserFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name UserFlagsBitField#bitfield
 */

/**
 * Numeric user flags.
 * @type {UserFlags}
 */
UserFlagsBitField.Flags = UserFlags;

module.exports = UserFlagsBitField;
