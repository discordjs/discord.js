'use strict';

const { ChannelFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link GuildChannel#flags} bitfield.
 * @extends {BitField}
 */
class GuildChannelFlagsBitField extends BitField {
  /**
   * Numeric guild channel flags.
   * @type {ChannelFlags}
   * @memberof GuildChannelFlagsBitField
   */
  static Flags = ChannelFlags;
}

/**
 * @name GuildChannelFlagsBitField
 * @kind constructor
 * @memberof GuildChannelFlagsBitField
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name GuildChannelFlagsBitField#bitfield
 */

module.exports = GuildChannelFlagsBitField;
