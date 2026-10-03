/* eslint-disable jsdoc/check-values */
import { RoleFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link Role#flags} bitfield.
 *
 * @extends {BitField}
 */
export class RoleFlagsBitField extends BitField {
  /**
   * Numeric role flags.
   *
   * @type {RoleFlags}
   * @memberof RoleFlagsBitField
   */
  static Flags = RoleFlags;
}

/**
 * @name RoleFlagsBitField
 * @kind constructor
 * @memberof RoleFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */
