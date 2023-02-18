'use strict';

const process = require('node:process');
const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const Permissions = require('../util/Permissions');

let deprecationEmittedForEditable = false;

/**
 * Represents a guild voice channel on Discord.
 * @extends {BaseGuildVoiceChannel}
 * @implements {TextBasedChannel}
 */
class VoiceChannel extends BaseGuildVoiceChannel {
  /**
   * Whether the channel is editable by the client user
   * @type {boolean}
   * @readonly
   * @deprecated Use {@link VoiceChannel#manageable} instead
   */
  get editable() {
    if (!deprecationEmittedForEditable) {
      process.emitWarning(
        'The VoiceChannel#editable getter is deprecated. Use VoiceChannel#manageable instead.',
        'DeprecationWarning',
      );

      deprecationEmittedForEditable = true;
    }

    return this.manageable;
  }

  /**
   * Whether the channel is joinable by the client user
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    if (!super.joinable) return false;
    if (this.full && !this.permissionsFor(this.client.user).has(Permissions.FLAGS.MOVE_MEMBERS, false)) return false;
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
    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR, false)) return true;

    return (
      this.guild.members.me.communicationDisabledUntilTimestamp < Date.now() &&
      permissions.has(Permissions.FLAGS.SPEAK, false)
    );
  }
  /**
   * Sets the bitrate of the channel.
   * @name VoiceChannel#setBitrate
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
   * @name VoiceChannel#setRTCRegion
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
   * @name VoiceChannel#setUserLimit
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
   * @name VoiceChannel#setVideoQualityMode
   * @param {VideoQualityMode|number} videoQualityMode The new camera video quality mode.
   * @param {string} [reason] Reason for changing the camera video quality mode.
   * @returns {Promise<VoiceChannel>}
   */
}

TextBasedChannel.applyToClass(VoiceChannel, true, ['lastPinAt']);

module.exports = VoiceChannel;
