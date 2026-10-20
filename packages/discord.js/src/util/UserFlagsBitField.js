/* eslint-disable jsdoc/check-values */
import { UserFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link User#flags} bitfield.
 *
 * @extends {BitField}
 */
export class UserFlagsBitField extends BitField {
  /**
   * Numeric user flags.
   *
   * @type {UserFlags}
   * @memberof UserFlagsBitField
   */
  static Flags = UserFlags;
}

/**
 * @name UserFlagsBitField
 * @kind constructor
 * @memberof UserFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 *
 * @type {number}
 * @name UserFlagsBitField#bitfield
 */
