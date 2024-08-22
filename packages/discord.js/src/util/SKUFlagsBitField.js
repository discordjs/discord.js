'use strict';

const { SKUFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link SKU#flags} bitfield.
 * @extends {BitField}
 */
class SKUFlagsBitField extends BitField {
  /**
   * Numeric SKU flags.
   * @type {SKUFlags}
   * @memberof SKUFlagsBitField
   */
  static Flags = SKUFlags;
}

/**
 * @name SKUFlagsBitField
 * @kind constructor
 * @memberof SKUFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

exports.SKUFlagsBitField = SKUFlagsBitField;
