'use strict';

const { ActivityFlags } = require('discord-api-types/v9');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link Activity#flags} bitfield.
 * @extends {BitField}
 */
class ActivityFlagsBitField extends BitField {}

/**
 * @name ActivityFlagsBitField
 * @kind constructor
 * @memberof ActivityFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Numeric activity flags.
 * @type {ActivityFlags}
 */
ActivityFlagsBitField.Flags = ActivityFlags;

module.exports = ActivityFlagsBitField;
