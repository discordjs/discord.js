/* eslint-disable jsdoc/check-values */
import { ThreadMemberFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link ThreadMember#flags} bitfield.
 *
 * @extends {BitField}
 */
export class ThreadMemberFlagsBitField extends BitField {
  /**
   * Numeric thread member flags. There are currently no bitflags relevant to bots for this.
   *
   * @type {ThreadMemberFlags}
   * @memberof ThreadMemberFlagsBitField
   */
  static Flags = ThreadMemberFlags;
}

/**
 * @name ThreadMemberFlagsBitField
 * @kind constructor
 * @memberof ThreadMemberFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 *
 * @type {number}
 * @name ThreadMemberFlagsBitField#bitfield
 */
