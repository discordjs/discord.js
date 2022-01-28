'use strict';

const { ApplicationFlags } = require('discord-api-types/v9');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link ClientApplication#flags} bitfield.
 * @extends {BitField}
 */
class ApplicationFlagsBitField extends BitField {}

/**
 * @name ApplicationFlagsBitField
 * @kind constructor
 * @memberof ApplicationFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name ApplicationFlagsBitField#bitfield
 */

/**
 * Numeric application flags. All available properties:
 * @type {ApplicationFlags}
 */
ApplicationFlagsBitField.Flags = ApplicationFlags;

module.exports = ApplicationFlagsBitField;
