'use strict';

const { ApplicationFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link ClientApplication#flags} bitfield.
 * @extends {BitField}
 */
class ApplicationFlagsBitField extends BitField {
  /**
   * Numeric application flags. All available properties:
   * @type {ApplicationFlags}
   * @memberof ApplicationFlagsBitField
   */
  static Flags = ApplicationFlags;
}

/**
 * @name ApplicationFlagsBitField
 * @kind constructor
 * @memberof ApplicationFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

module.exports = ApplicationFlagsBitField;
