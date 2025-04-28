'use strict';

const { PermissionFlagsBits, Routes } = require('discord-api-types/v10');
const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');

/**
 * Represents a guild voice channel on Discord.
 * @extends {BaseGuildVoiceChannel}
 */
class VoiceChannel extends BaseGuildVoiceChannel {
  /**
   * Whether the channel is joinable by the client user
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    if (!super.joinable) return false;
    if (this.full && !this.permissionsFor(this.client.user).has(PermissionFlagsBits.MoveMembers, false)) return false;
    return true;
  }

  /**
   * Checks if the client has permission to send audio to the voice channel
   * @type {boolean}
   * @readonly
   */
  get speakable() {
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;
    // This flag allows speaking even if timed out
    if (permissions.has(PermissionFlagsBits.Administrator, false)) return true;

    return (
      this.guild.members.me.communicationDisabledUntilTimestamp < Date.now() &&
      permissions.has(PermissionFlagsBits.Speak, false)
    );
  }

  /**
   * @typedef {Object} SendSoundboardSoundOptions
   * @property {string} soundId The id of the soundboard sound to send
   * @property {string} [guildId] The id of the guild the soundboard sound is a part of
   */

  /**
   * Send a soundboard sound to a voice channel the user is connected to.
   * @param {SoundboardSound|SendSoundboardSoundOptions} sound The sound to send
   * @returns {Promise<void>}
   */
  async sendSoundboardSound(sound) {
    await this.client.rest.post(Routes.sendSoundboardSound(this.id), {
      body: {
        sound_id: sound.soundId,
        source_guild_id: sound.guildId ?? undefined,
      },
    });
  }
}

/**
 * Sets the bitrate of the channel.
 * @method setBitrate
 * @memberof VoiceChannel
 * @instance
 * @param {number} bitrate The new bitrate
 * @param {string} [reason] Reason for changing the channel's bitrate
 * @returns {Promise<VoiceChannel>}
 * @example
 * // Set the bitrate of a voice channel
 * voiceChannel.setBitrate(48_000)
 *   .then(channel => console.log(`Set bitrate to ${channel.bitrate}bps for ${channel.name}`))
 *   .catch(console.error);
 */

/**
 * Sets the RTC region of the channel.
 * @method setRTCRegion
 * @memberof VoiceChannel
 * @instance
 * @param {?string} rtcRegion The new region of the channel. Set to `null` to remove a specific region for the channel
 * @param {string} [reason] The reason for modifying this region.
 * @returns {Promise<VoiceChannel>}
 * @example
 * // Set the RTC region to sydney
 * voiceChannel.setRTCRegion('sydney');
 * @example
 * // Remove a fixed region for this channel - let Discord decide automatically
 * voiceChannel.setRTCRegion(null, 'We want to let Discord decide.');
 */

/**
 * Sets the user limit of the channel.
 * @method setUserLimit
 * @memberof VoiceChannel
 * @instance
 * @param {number} userLimit The new user limit
 * @param {string} [reason] Reason for changing the user limit
 * @returns {Promise<VoiceChannel>}
 * @example
 * // Set the user limit of a voice channel
 * voiceChannel.setUserLimit(42)
 *   .then(channel => console.log(`Set user limit to ${channel.userLimit} for ${channel.name}`))
 *   .catch(console.error);
 */

/**
 * Sets the camera video quality mode of the channel.
 * @method setVideoQualityMode
 * @memberof VoiceChannel
 * @instance
 * @param {VideoQualityMode} videoQualityMode The new camera video quality mode.
 * @param {string} [reason] Reason for changing the camera video quality mode.
 * @returns {Promise<VoiceChannel>}
 */

module.exports = VoiceChannel;
