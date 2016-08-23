const Collection = require('../../util/Collection');
const mergeDefault = require('../../util/MergeDefault');
const Constants = require('../../util/Constants');
const VoiceConnection = require('./VoiceConnection');

/**
 * Manages all the voice stuff for the Client
 * @private
 */
class ClientVoiceManager {
  constructor(client) {
    /**
     * The client that instantiated this voice manager
     * @type {Client}
     */
    this.client = client;
    /**
     * A collection mapping connection IDs to the Connection objects
     * @type {Collection<String, VoiceConnection>}
     */
    this.connections = new Collection();
    /**
     * Pending connection attempts, maps Guild ID to VoiceChannel
     * @type {Collection<String, VoiceChannel>}
     */
    this.pending = new Collection();
  }

  _checkPendingReady(guildID) {
    const pendingRequest = this.pending.get(guildID);
    if (!pendingRequest) {
      throw new Error('Guild not pending');
    }
    if (pendingRequest.token && pendingRequest.sessionID && pendingRequest.endpoint) {
      const { token, sessionID, endpoint } = pendingRequest;
      const voiceConnection = new VoiceConnection(this, guildID, token, sessionID, endpoint);
      this.connections.set(guildID, voiceConnection);
    }
  }

  /**
   * Called when the Client receives information about this voice server update.
   * @param {String} guildID the ID of the Guild
   * @param {String} token the token to authorise with
   * @param {String} endpoint the endpoint to connect to
   */
  _receivedVoiceServer(guildID, token, endpoint) {
    const pendingRequest = this.pending.get(guildID);
    if (!pendingRequest) {
      throw new Error('Guild not pending');
    }
    pendingRequest.token = token;
    // remove the port otherwise it errors ¯\_(ツ)_/¯
    pendingRequest.endpoint = endpoint.match(/([^:]*)/)[0];
    this._checkPendingReady(guildID);
  }

  /**
   * Called when the Client receives information about the voice state update.
   * @param {String} guildID the ID of the Guild
   * @param {String} sessionID the session id to authorise with
   */
  _receivedVoiceStateUpdate(guildID, sessionID) {
    const pendingRequest = this.pending.get(guildID);
    if (!pendingRequest) {
      throw new Error('Guild not pending');
    }
    pendingRequest.sessionID = sessionID;
    this._checkPendingReady(guildID);
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
    this.pending.set(channel.guild.id, {
      channel,
      sessionID: null,
      token: null,
      endpoint: null,
    });
    this._sendWSJoin(channel);
  }
}

module.exports = ClientVoiceManager;
