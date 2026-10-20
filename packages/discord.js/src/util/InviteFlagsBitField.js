/* eslint-disable jsdoc/check-values */
import { InviteFlags } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to interact with a {@link GuildInvite#flags} bit field.
 *
 * @extends {BitField}
 */
export class InviteFlagsBitField extends BitField {
  /**
   * Numeric invite flags.
   *
   * @type {InviteFlags}
   * @memberof InviteFlagsBitField
   */
  static Flags = InviteFlags;
}

/**
 * @name InviteFlagsBitField
 * @kind constructor
 * @memberof InviteFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */
