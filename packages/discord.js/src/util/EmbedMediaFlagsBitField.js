/* eslint-disable jsdoc/check-values */
'use strict';

const { EmbedMediaFlags } = require('discord-api-types/v10');
const { BitField } = require('./BitField.js');

/**
 * Data structure that makes it easy to interact with embed media flags bitfields,
 * as used on embed images, videos, and thumbnails.
 *
 * @extends {BitField}
 */
class EmbedMediaFlagsBitField extends BitField {
  /**
   * Numeric embed media flags.
   *
   * @type {EmbedMediaFlags}
   * @memberof EmbedMediaFlagsBitField
   */
  static Flags = EmbedMediaFlags;
}

/**
 * @name EmbedMediaFlagsBitField
 * @kind constructor
 * @memberof EmbedMediaFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

exports.EmbedMediaFlagsBitField = EmbedMediaFlagsBitField;
