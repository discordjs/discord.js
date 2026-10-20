/* eslint-disable jsdoc/check-values */
import { SKUFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with an {@link SKU#flags} bitfield.
 *
 * @extends {BitField}
 */
export class SKUFlagsBitField extends BitField {
  /**
   * Numeric SKU flags.
   *
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
