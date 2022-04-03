'use strict';

const { GuildSystemChannelFlags } = require('discord-api-types/v10');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link Guild#systemChannelFlags} bitfield.
 * <info>Note that all event message types are enabled by default,
 * and by setting their corresponding flags you are disabling them</info>
 * @extends {BitField}
 */
class SystemChannelFlagsBitField extends BitField {
  /**
   * Numeric system channel flags.
   * @type {GuildSystemChannelFlags}
   * @memberof SystemChannelFlagsBitField
   */
  static Flags = GuildSystemChannelFlags;
}

/**
 * @name SystemChannelFlagsBitField
 * @kind constructor
 * @memberof SystemChannelFlagsBitField
 * @param {SystemChannelFlagsResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name SystemChannelFlagsBitField#bitfield
 */

/**
 * Data that can be resolved to give a system channel flag bitfield. This can be:
 * * A string (see {@link SystemChannelFlagsBitField.Flags})
 * * A system channel flag
 * * An instance of SystemChannelFlagsBitField
 * * An Array of SystemChannelFlagsResolvable
 * @typedef {string|number|SystemChannelFlagsBitField|SystemChannelFlagsResolvable[]} SystemChannelFlagsResolvable
 */

module.exports = SystemChannelFlagsBitField;
