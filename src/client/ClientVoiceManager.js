const Collection = require('../util/Collection');

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
   * Sets up a request to join a voice channel
   * @param {VoiceChannel} channel the voice channel to join
   * @returns {null}
   */
  joinChannel(channel) {
    return channel;
  }
}

module.exports = ClientVoiceManager;
