'use strict';

const { InviteFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link GuildInvite#flags} bit field.
 *
 * @extends {BitField}
 */
class InviteFlagsBitField extends BitField {
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

exports.InviteFlagsBitField = InviteFlagsBitField;
