'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link VoiceConnection#speaking}
 * and {@link guildMemberSpeaking} event bitfields.
 * @extends {BitField}
 */
class Speaking extends BitField {}

/**
 * @name Speaking
 * @kind constructor
 * @memberof Speaking
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name Speaking#bitfield
 */

/**
 * Numeric speaking flags. All available properties:
 * * `SPEAKING`
 * * `SOUNDSHARE`
 * * `PRIORITY_SPEAKING`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/topics/voice-connections#speaking}
 */
Speaking.FLAGS = {
  SPEAKING: 1 << 0,
  SOUNDSHARE: 1 << 1,
  PRIORITY_SPEAKING: 1 << 2,
};

module.exports = Speaking;
