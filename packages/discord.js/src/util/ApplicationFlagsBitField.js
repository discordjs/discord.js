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

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name ApplicationFlagsBitField#bitfield
 */

/**
 * Data that can be resolved to give an application flag bit field. This can be:
 * * A string (see {@link ApplicationFlagsBitField.Flags})
 * * An application flag
 * * An instance of ApplicationFlagsBitField
 * * An Array of ApplicationFlagsResolvable
 * @typedef {string|number|ApplicationFlagsBitField|ApplicationFlagsResolvable[]} ApplicationFlagsResolvable
 */

module.exports = ApplicationFlagsBitField;
