const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link VoiceConnection#speaking}
 * and {@link guildMemberSpeaking} event bitfields.
 */
class Speaking extends BitField {}

/**
 * Numeric speaking flags. All available properties:
 * * `NONE`
 * * `SPEAKING`
 * * `SOUNDSHARE`
 * @type {Object}
 * @see {@link https://discordapp.com/developers/docs/topics/voice-connections#speaking}
 */
Speaking.flags = {
  NONE: 1 << 0,
  SPEAKING: 1 << 1,
  SOUNDSHARE: 1 << 2,
};

module.exports = Speaking;
