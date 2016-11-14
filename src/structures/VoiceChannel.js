const GuildChannel = require('./GuildChannel');

/**
 * Represents a guild voice channel on Discord.
 * @extends {GuildChannel}
 */
class VoiceChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);

    this.type = 'voice';
  }

  setup(data) {
    super.setup(data);

    /**
     * The bitrate of this voice channel
     * @type {number}
     */
    this.bitrate = data.bitrate;

    /**
     * The maximum amount of users allowed in this channel - 0 means unlimited.
     * @type {number}
     */
    this.userLimit = data.user_limit;
  }

  /**
   * The voice connection for this voice channel, if the client is connected
   * @type {?VoiceConnection}
   * @readonly
   */
  get connection() {
    const connection = this.guild.voiceConnection;
    if (connection && connection.channel.id === this.id) return connection;
    return null;
  }

  /**
   * Checks if the client has permission join the voice channel
   * @type {boolean}
   */
  get joinable() {
    return this.permissionsFor(this.client.user).hasPermission('CONNECT');
  }

  /**
   * Checks if the client has permission to send audio to the voice channel
   * @type {boolean}
   */
  get speakable() {
    return this.permissionsFor(this.client.user).hasPermission('SPEAK');
  }

  /**
   * The members in this voice channel.
   * @type {Collection<string, GuildMember>}
   */
  get members() {
    return this.guild.members.filter(m => m.voiceChannelID === this.id);
  }

  /**
   * Sets the bitrate of the channel
   * @param {number} bitrate The new bitrate
   * @returns {Promise<VoiceChannel>}
   * @example
   * // set the bitrate of a voice channel
   * voiceChannel.setBitrate(48000)
   *  .then(vc => console.log(`Set bitrate to ${vc.bitrate} for ${vc.name}`))
   *  .catch(console.error);
   */
  setBitrate(bitrate) {
    return this.edit({ bitrate });
  }

  /**
   * Sets the user limit of the channel
   * @param {number} userLimit The new user limit
   * @returns {Promise<VoiceChannel>}
   * @example
   * // set the user limit of a voice channel
   * voiceChannel.setUserLimit(42)
   *  .then(vc => console.log(`Set user limit to ${vc.userLimit} for ${vc.name}`))
   *  .catch(console.error);
   */
  setUserLimit(userLimit) {
    return this.edit({ userLimit });
  }

  /**
   * Attempts to join this voice channel
   * @returns {Promise<VoiceConnection>}
   * @example
   * // join a voice channel
   * voiceChannel.join()
   *  .then(connection => console.log('Connected!'))
   *  .catch(console.error);
   */
  join() {
    return this.client.voice.joinChannel(this);
  }

  /**
   * Leaves this voice channel
   * @example
   * // leave a voice channel
   * voiceChannel.leave();
   */
  leave() {
    const connection = this.client.voice.connections.get(this.guild.id);
    if (connection && connection.channel.id === this.id) connection.disconnect();
  }
}

module.exports = VoiceChannel;
