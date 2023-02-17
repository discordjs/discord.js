'use strict';

const { GuildMemberFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link GuildMember#flags} bitfield.
 * @extends {BitField}
 */
class GuildMemberFlagsBitField extends BitField {
  /**
   * Numeric guild guild member flags.
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
 * @type {number}
 * @name GuildMemberFlagsBitField#bitfield
 */

/**
 * Data that can be resolved to give a guild member flag bitfield. This can be:
 * * A string (see {@link GuildMemberFlagsBitField.Flags})
 * * A guild member flag
 * * An instance of GuildMemberFlagsBitField
 * * An Array of GuildMemberFlagsResolvable
 * @typedef {string|number|GuildMemberFlagsBitField|GuildMemberFlagsResolvable[]} GuildMemberFlagsResolvable
 */

exports.GuildMemberFlagsBitField = GuildMemberFlagsBitField;
