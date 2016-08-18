const GuildChannel = require('./GuildChannel');
const VoiceChannelDataStore = require('./datastore/VoiceChannelDataStore');

/**
 * Represents a Server Voice Channel on Discord.
 * @extends {GuildChannel}
 */
class VoiceChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);
    this.store = new VoiceChannelDataStore();
  }

  setup(data) {
    super.setup(data);
    /**
     * The bitrate of this voice channel
     * @type {Number}
     */
    this.bitrate = data.bitrate;
    /**
     * The maximum amount of users allowed in this channel - 0 means unlimited.
     * @type {Number}
     */
    this.userLimit = data.user_limit;
  }

  /**
   * Sets the bitrate of the channel
   * @param {Number} bitrate the new bitrate
   * @returns {Promise<VoiceChannel>}
   * @example
   * // set the bitrate of a voice channel
   * voiceChannel.setBitrate(48000)
   *  .then(vc => console.log(`Set bitrate to ${vc.bitrate} for ${vc.name}`))
   *  .catch(console.log);
   */
  setBitrate(bitrate) {
    return this.rest.client.rest.methods.updateChannel(this, { bitrate });
  }
}

module.exports = VoiceChannel;
