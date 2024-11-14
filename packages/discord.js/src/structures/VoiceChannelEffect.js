'use strict';

const { Emoji } = require('./Emoji');

/**
 * Represents an effect used in a {@link VoiceChannel}.
 */
class VoiceChannelEffect {
  constructor(data, guild) {
    /**
     * The guild where the effect was sent from.
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The id of the channel the effect was sent in.
     * @type {Snowflake}
     */
    this.channelId = data.channel_id;

    /**
     * The id of the user that sent the effect.
     * @type {Snowflake}
     */
    this.userId = data.user_id;

    /**
     * The emoji of the effect.
     * @type {?Emoji}
     */
    this.emoji = data.emoji ? new Emoji(guild.client, data.emoji) : null;

    /**
     * The animation type of the effect.
     * @type {?VoiceChannelEffectSendAnimationType}
     */
    this.animationType = data.animation_type ?? null;

    /**
     * The animation id of the effect.
     * @type {?number}
     */
    this.animationId = data.animation_id ?? null;

    /**
     * The id of the soundboard sound for soundboard effects.
     * @type {?(Snowflake|number)}
     */
    this.soundId = data.sound_id ?? null;

    /**
     * The volume of the soundboard sound [0-1] for soundboard effects.
     * @type {?number}
     */
    this.soundVolume = data.sound_volume ?? null;
  }

  /**
   * The channel the effect was sent in.
   * @type {?VoiceChannel}
   * @readonly
   */
  get channel() {
    return this.guild.channels.cache.get(this.channelId) ?? null;
  }
}

module.exports = VoiceChannelEffect;
