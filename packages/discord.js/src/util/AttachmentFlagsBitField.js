'use strict';

const { AttachmentFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with an {@link Attachment#flags} bitfield.
 * @extends {BitField}
 */
class AttachmentFlagsBitField extends BitField {
  /**
   * Numeric attachment flags.
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

module.exports = AttachmentFlagsBitField;
