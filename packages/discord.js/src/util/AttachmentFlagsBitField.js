/* eslint-disable jsdoc/check-values */
import { AttachmentFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with an {@link Attachment#flags} bitfield.
 *
 * @extends {BitField}
 */
export class AttachmentFlagsBitField extends BitField {
  /**
   * Numeric attachment flags.
   *
   * @type {AttachmentFlags}
   * @memberof AttachmentFlagsBitField
   */
  static Flags = AttachmentFlags;
}

/**
 * @name AttachmentFlagsBitField
 * @kind constructor
 * @memberof AttachmentFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */
