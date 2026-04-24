/* eslint-disable jsdoc/check-values */
'use strict';

const { EmbedFlags } = require('discord-api-types/v10');
const { BitField } = require('./BitField.js');

/**
 * Data structure that makes it easy to interact with an {@link Embed#flags} bitfield.
 *
 * @extends {BitField}
 */
class EmbedFlagsBitField extends BitField {
  /**
   * Numeric embed flags.
   *
   * @type {EmbedFlags}
   * @memberof EmbedFlagsBitField
   */
  static Flags = EmbedFlags;
}

/**
 * @name EmbedFlagsBitField
 * @kind constructor
 * @memberof EmbedFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

exports.EmbedFlagsBitField = EmbedFlagsBitField;
