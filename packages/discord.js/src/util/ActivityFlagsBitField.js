'use strict';

const { ActivityFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link Activity#flags} bitfield.
 * @extends {BitField}
 */
class ActivityFlagsBitField extends BitField {
  /**
   * Numeric activity flags.
   * @type {ActivityFlags}
   * @memberof ActivityFlagsBitField
   */
  static Flags = ActivityFlags;
}

/**
 * @name ActivityFlagsBitField
 * @kind constructor
 * @memberof ActivityFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

module.exports = ActivityFlagsBitField;
