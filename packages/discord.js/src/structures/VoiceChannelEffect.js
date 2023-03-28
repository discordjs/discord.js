'use strict';

/**
 * Represents an effect used in a voice channel.
 */
class VoiceChannelEffect {
  constructor(data, guild) {
    /**
     * The guild where this effect was sent from.
     * @type {Guild}
     */
    this.guild = guild;
  }
}

module.exports = VoiceChannelEffect;
