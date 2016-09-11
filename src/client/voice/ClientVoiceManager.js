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
     * @type {Collection<string, VoiceConnection>}
     */
    this.connections = new Collection();
    /**
     * Pending connection attempts, maps Guild ID to VoiceChannel
     * @type {Collection<string, VoiceChannel>}
     */
    this.pending = new Collection();
  }

  /**
   * Checks whether a pending request can be processed
   * @private
   * @param {string} guildID The ID of the Guild
   */
  _checkPendingReady(guildID) {
    const pendingRequest = this.pending.get(guildID);
    if (!pendingRequest) throw new Error('Guild not pending.');
    if (pendingRequest.token && pendingRequest.sessionID && pendingRequest.endpoint) {
      const { channel, token, sessionID, endpoint, resolve, reject } = pendingRequest;
      const voiceConnection = new VoiceConnection(this, channel, token, sessionID, endpoint, resolve, reject);
      this.pending.delete(guildID);
      this.connections.set(guildID, voiceConnection);
      voiceConnection.once('disconnected', () => {
        this.connections.delete(guildID);
      });
    }
  }

  /**
   * Called when the Client receives information about this voice server update.
   * @param {string} guildID The ID of the Guild
   * @param {string} token The token to authorise with
   * @param {string} endpoint The endpoint to connect to
   */
  _receivedVoiceServer(guildID, token, endpoint) {
    const pendingRequest = this.pending.get(guildID);
    if (!pendingRequest) throw new Error('Guild not pending.');
    pendingRequest.token = token;
    // remove the port otherwise it errors ¯\_(ツ)_/¯
    pendingRequest.endpoint = endpoint.match(/([^:]*)/)[0];
    this._checkPendingReady(guildID);
  }

  /**
   * Called when the Client receives information about the voice state update.
   * @param {string} guildID The ID of the Guild
   * @param {string} sessionID The session id to authorise with
   */
  _receivedVoiceStateUpdate(guildID, sessionID) {
    const pendingRequest = this.pending.get(guildID);
    if (!pendingRequest) throw new Error('Guild not pending.');
    pendingRequest.sessionID = sessionID;
    this._checkPendingReady(guildID);
  }

  /**
   * Sends a request to the main gateway to join a voice channel
   * @param {VoiceChannel} channel The channel to join
   * @param {Object} [options] The options to provide
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
   * @param {VoiceChannel} channel The voice channel to join
   * @returns {Promise<VoiceConnection>}
   */
  joinChannel(channel) {
    return new Promise((resolve, reject) => {
      if (this.pending.get(channel.guild.id)) {
        throw new Error(`Already connecting to a channel in guild.`);
      }
      const existingConn = this.connections.get(channel.guild.id);
      if (existingConn) {
        if (existingConn.channel.id !== channel.id) {
          this._sendWSJoin(channel);
          this.connections.get(channel.guild.id).channel = channel;
        }
        resolve(existingConn);
        return;
      }
      this.pending.set(channel.guild.id, {
        channel,
        sessionID: null,
        token: null,
        endpoint: null,
        resolve,
        reject,
      });
      this._sendWSJoin(channel);
      this.client.setTimeout(() => reject(new Error('Connection not established within 15 seconds.')), 15000);
    });
  }
}

module.exports = ClientVoiceManager;
