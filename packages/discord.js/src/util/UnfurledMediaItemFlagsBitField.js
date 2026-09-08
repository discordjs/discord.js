/* eslint-disable jsdoc/check-values */
'use strict';

const { UnfurledMediaItemFlags } = require('discord-api-types/v10');
const { BitField } = require('./BitField.js');

/**
 * Data structure that makes it easy to interact with an {@link UnfurledMediaItem#flags} bitfield.
 *
 * @extends {BitField}
 */
class UnfurledMediaItemFlagsBitField extends BitField {
  /**
   * Numeric unfurled media item flags.
   *
   * @type {UnfurledMediaItemFlags}
   * @memberof UnfurledMediaItemFlagsBitField
   */
  static Flags = UnfurledMediaItemFlags;
}

/**
 * @name UnfurledMediaItemFlagsBitField
 * @kind constructor
 * @memberof UnfurledMediaItemFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

exports.UnfurledMediaItemFlagsBitField = UnfurledMediaItemFlagsBitField;
