const Collection = require('../../util/Collection');
const mergeDefault = require('../../util/MergeDefault');
const Constants = require('../../util/Constants');
const VoiceConnection = require('./VoiceConnection');
const EventEmitter = require('events').EventEmitter;

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

    this.client.on('self.voiceServer', this.onVoiceServer.bind(this));
    this.client.on('self.voiceStateUpdate', this.onVoiceStateUpdate.bind(this));
  }

  onVoiceServer(data) {
    if (this.pending.has(data.guild_id)) this.pending.get(data.guild_id).setTokenAndEndpoint(data.token, data.endpoint);
  }

  onVoiceStateUpdate(data) {
    if (this.pending.has(data.guild_id)) this.pending.get(data.guild_id).setSessionID(data.session_id);
  }

  /**
   * Sends a request to the main gateway to join a voice channel
   * @param {VoiceChannel} channel The channel to join
   * @param {Object} [options] The options to provide
   */
  sendVoiceStateUpdate(channel, options = {}) {
    if (!this.client.user) throw new Error('Unable to join because there is no client user.');
    if (!channel.permissionsFor) {
      throw new Error('Channel does not support permissionsFor; is it really a voice channel?');
    }
    const permissions = channel.permissionsFor(this.client.user);
    if (!permissions) {
      throw new Error('There is no permission set for the client user in this channel - are they part of the guild?');
    }
    if (!permissions.hasPermission('CONNECT')) {
      throw new Error('You do not have permission to connect to this voice channel.');
    }

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
      if (this.pending.get(channel.guild.id)) throw new Error('Already connecting to this guild\'s voice server.');

      if (!channel.joinable) {
        throw new Error('You do not have permission to join this voice channel');
      }

      const existingConnection = this.connections.get(channel.guild.id);
      if (existingConnection) {
        if (existingConnection.channel.id !== channel.id) {
          this.sendVoiceStateUpdate(channel);
          this.connections.get(channel.guild.id).channel = channel;
        }
        resolve(existingConnection);
        return;
      }

      const pendingConnection = new PendingVoiceConnection(this, channel);
      this.pending.set(channel.guild.id, pendingConnection);

      pendingConnection.on('fail', reason => {
        this.pending.delete(channel.guild.id);
        reject(reason);
      });

      pendingConnection.on('pass', voiceConnection => {
        this.pending.delete(channel.guild.id);
        this.connections.set(channel.guild.id, voiceConnection);
        voiceConnection.once('ready', () => resolve(voiceConnection));
        voiceConnection.once('error', reject);
        voiceConnection.once('disconnect', () => this.connections.delete(channel.guild.id));
      });
    });
  }
}

/**
 * Represents a Pending Voice Connection
 * @private
 */
class PendingVoiceConnection extends EventEmitter {
  constructor(voiceManager, channel) {
    super();

    /**
     * The ClientVoiceManager that instantiated this pending connection
     * @type {ClientVoiceManager}
     */
    this.voiceManager = voiceManager;

    /**
     * The channel that this pending voice connection will attempt to join
     * @type {VoiceChannel}
     */
    this.channel = channel;

    /**
     * The timeout that will be invoked after 15 seconds signifying a failure to connect
     * @type {Timeout}
     */
    this.deathTimer = this.voiceManager.client.setTimeout(
      () => this.fail(new Error('Connection not established within 15 seconds.')), 15000);

    /**
     * An object containing data required to connect to the voice servers with
     * @type {object}
     */
    this.data = {};

    this.sendVoiceStateUpdate();
  }

  checkReady() {
    if (this.data.token && this.data.endpoint && this.data.session_id) {
      this.pass();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Set the token and endpoint required to connect to the the voice servers
   * @param {string} token the token
   * @param {string} endpoint the endpoint
   * @returns {void}
   */
  setTokenAndEndpoint(token, endpoint) {
    if (!token) {
      this.fail(new Error('Token not provided from voice server packet.'));
      return;
    }
    if (!endpoint) {
      this.fail(new Error('Endpoint not provided from voice server packet.'));
      return;
    }
    if (this.data.token) {
      this.fail(new Error('There is already a registered token for this connection.'));
      return;
    }
    if (this.data.endpoint) {
      this.fail(new Error('There is already a registered endpoint for this connection.'));
      return;
    }

    endpoint = endpoint.match(/([^:]*)/)[0];

    if (!endpoint) {
      this.fail(new Error('Failed to find an endpoint.'));
      return;
    }

    this.data.token = token;
    this.data.endpoint = endpoint;

    this.checkReady();
  }

  /**
   * Sets the Session ID for the connection
   * @param {string} sessionID the session ID
   */
  setSessionID(sessionID) {
    if (!sessionID) {
      this.fail(new Error('Session ID not supplied.'));
      return;
    }
    if (this.data.session_id) {
      this.fail(new Error('There is already a registered session ID for this connection.'));
      return;
    }
    this.data.session_id = sessionID;

    this.checkReady();
  }

  clean() {
    clearInterval(this.deathTimer);
    this.emit('fail', new Error('Clean-up triggered :fourTriggered:'));
  }

  pass() {
    clearInterval(this.deathTimer);
    this.emit('pass', this.upgrade());
  }

  fail(reason) {
    this.emit('fail', reason);
    this.clean();
  }

  sendVoiceStateUpdate() {
    try {
      this.voiceManager.sendVoiceStateUpdate(this.channel);
    } catch (error) {
      this.fail(error);
    }
  }

  /**
   * Upgrades this Pending Connection to a full Voice Connection
   * @returns {VoiceConnection}
   */
  upgrade() {
    return new VoiceConnection(this);
  }
}

module.exports = ClientVoiceManager;
