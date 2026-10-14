/* eslint-disable jsdoc/check-values */
import { ActivityFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with an {@link Activity#flags} bitfield.
 *
 * @extends {BitField}
 */
export class ActivityFlagsBitField extends BitField {
  /**
   * Numeric activity flags.
   *
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
