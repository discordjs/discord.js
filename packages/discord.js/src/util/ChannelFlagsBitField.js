/* eslint-disable jsdoc/check-values */
import { ChannelFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link BaseChannel#flags} bitfield.
 *
 * @extends {BitField}
 */
export class ChannelFlagsBitField extends BitField {
  /**
   * Numeric guild channel flags.
   *
   * @type {ChannelFlags}
   * @memberof ChannelFlagsBitField
   */
  static Flags = ChannelFlags;
}

/**
 * @name ChannelFlagsBitField
 * @kind constructor
 * @memberof ChannelFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 *
 * @type {number}
 * @name ChannelFlagsBitField#bitfield
 */

/**
 * Data that can be resolved to give a channel flag bitfield. This can be:
 * - A string (see {@link ChannelFlagsBitField.Flags})
 * - A channel flag
 * - An instance of ChannelFlagsBitField
 * - An Array of ChannelFlagsResolvable
 *
 * @typedef {string|number|ChannelFlagsBitField|ChannelFlagsResolvable[]} ChannelFlagsResolvable
 */
