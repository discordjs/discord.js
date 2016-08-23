const Collection = require('../util/Collection');
const mergeDefault = require('../util/MergeDefault');
const Constants = require('../util/Constants');

/**
 * Manages all the voice stuff for the Client
 * @private
 */
class ClientVoiceManager {
  constructor(client) {
    /**
     * The client that instantiated this voice manager
     */
    this.client = client;
    /**
     * A collection mapping connection IDs to the Connection objects
     */
    this.connections = new Collection();
  }

  /**
   * Sends a request to the main gateway to join a voice channel
   * @param {VoiceChannel} channel the channel to join
   * @param {Object} [options] the options to provide
   */
  _sendWSJoin(channel, options = {}) {
    options = mergeDefault({
      guild_id: channel.guild.id,
      channel_id: channel.id,
      self_mute: false,
      self_deaf: false,
    }, options);
    this.client.ws.send({
      op: Constants.OPCodes.VOICE_STATE_UPDATE,
      d: options,
    });
  }

  /**
   * Sets up a request to join a voice channel
   * @param {VoiceChannel} channel the voice channel to join
   * @returns {null}
   */
  joinChannel(channel) {
    this._sendWSJoin(channel);
  }
}

module.exports = ClientVoiceManager;
