'use strict';

const { RoleFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link Role#flags} bitfield.
 * @extends {BitField}
 */
class RoleFlagsBitField extends BitField {
  /**
   * Numeric role flags.
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

module.exports = RoleFlagsBitField;
