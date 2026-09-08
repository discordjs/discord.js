/* eslint-disable jsdoc/check-values */
'use strict';

const { ApplicationFlags } = require('discord-api-types/v10');
const { BitField } = require('./BitField.js');

/**
 * Data structure that makes it easy to interact with a {@link ClientApplication#flags} bitfield.
 *
 * @extends {BitField}
 */
class ApplicationFlagsBitField extends BitField {
  /**
   * Numeric application flags. All available properties:
   *
   * @type {ApplicationFlags}
   * @memberof ApplicationFlagsBitField
   * @see {@link https://docs.discord.com/developers/resources/application#application-object-application-flags}
   */
  static Flags = ApplicationFlags;

  /**
   * @type {bigint}
   * @memberof ApplicationFlagsBitField
   * @private
   */
  static DefaultBit = 0n;

  /**
   * Resolves application flags to their bigint form.
   *
   * @param {ApplicationFlagsResolvable} [bit] Bit(s) to resolve
   * @returns {bigint}
   */
  static resolve(bit) {
    if (typeof bit === 'number' && Number.isSafeInteger(bit) && bit >= 0) return BigInt(bit);

    if (typeof bit === 'string') {
      const flag = this.Flags[bit];
      if (typeof flag === 'number') return BigInt(flag);
    }

    return super.resolve(bit);
  }
}

/**
 * @name ApplicationFlagsBitField
 * @kind constructor
 * @memberof ApplicationFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 *
 * @type {bigint}
 * @name ApplicationFlagsBitField#bitfield
 */

/**
 * Data that can be resolved to give an application flag bit field. This can be:
 * - A string (see {@link ApplicationFlagsBitField.Flags})
 * - An application flag
 * - An instance of ApplicationFlagsBitField
 * - An Array of ApplicationFlagsResolvable
 *
 * @typedef {string|number|bigint|ApplicationFlagsBitField|ApplicationFlagsResolvable[]} ApplicationFlagsResolvable
 */

exports.ApplicationFlagsBitField = ApplicationFlagsBitField;
