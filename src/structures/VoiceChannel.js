const GuildChannel = require('./GuildChannel');
const Collection = require('../util/Collection');

/**
 * Represents a Server Voice Channel on Discord.
 * @extends {GuildChannel}
 */
class VoiceChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);

    /**
     * The members in this Voice Channel.
     * @type {Collection<string, GuildMember>}
     */
    this.members = new Collection();

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
    return this.rest.client.rest.methods.updateChannel(this, { bitrate });
  }

  /**
   * Attempts to join this Voice Channel
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
