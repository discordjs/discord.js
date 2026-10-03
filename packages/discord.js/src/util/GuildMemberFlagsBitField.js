/* eslint-disable jsdoc/check-values */
import { GuildMemberFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link GuildMember#flags} bitfield.
 *
 * @extends {BitField}
 */
export class GuildMemberFlagsBitField extends BitField {
  /**
   * Numeric guild member flags.
   *
   * @type {GuildMemberFlags}
   * @memberof GuildMemberFlagsBitField
   */
  static Flags = GuildMemberFlags;
}

/**
 * @name GuildMemberFlagsBitField
 * @kind constructor
 * @memberof GuildMemberFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 *
 * @type {number}
 * @name GuildMemberFlagsBitField#bitfield
 */

/**
 * Data that can be resolved to give a guild member flag bitfield. This can be:
 * - A string (see {@link GuildMemberFlagsBitField.Flags})
 * - A guild member flag
 * - An instance of GuildMemberFlagsBitField
 * - An Array of GuildMemberFlagsResolvable
 *
 * @typedef {string|number|GuildMemberFlagsBitField|GuildMemberFlagsResolvable[]} GuildMemberFlagsResolvable
 */
