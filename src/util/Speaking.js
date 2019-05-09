'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link VoiceConnection#speaking}
 * and {@link guildMemberSpeaking} event bitfields.
 * @extends {BitField}
 */
class Speaking extends BitField {}

/**
 * Numeric speaking flags. All available properties:
 * * `SPEAKING`
 * * `SOUNDSHARE`
 * @type {Object}
 * @see {@link https://discordapp.com/developers/docs/topics/voice-connections#speaking}
 */
Speaking.FLAGS = {
  SPEAKING: 1 << 0,
  SOUNDSHARE: 1 << 1,
};

module.exports = Speaking;
