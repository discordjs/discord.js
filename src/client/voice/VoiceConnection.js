const VoiceWebSocket = require('./networking/VoiceWebSocket');
const VoiceUDP = require('./networking/VoiceUDPClient');
const Util = require('../../util/Util');
const { OPCodes, VoiceOPCodes, VoiceStatus } = require('../../util/Constants');
const AudioPlayer = require('./player/AudioPlayer');
const VoiceReceiver = require('./receiver/Receiver');
const EventEmitter = require('events');
const { Error } = require('../../errors');
const PlayInterface = require('./util/PlayInterface');

/**
 * Represents a connection to a guild's voice server.
 * ```js
 * // Obtained using:
 * voiceChannel.join()
 *   .then(connection => {
 *
 *   });
 * ```
 * @extends {EventEmitter}
 * @implements {PlayInterface}
 */
class VoiceConnection extends EventEmitter {
  constructor(voiceManager, channel) {
    super();

    /**
     * The voice manager that instantiated this connection
     * @type {ClientVoiceManager}
     */
    this.voiceManager = voiceManager;

    /**
     * The client that instantiated this connection
     * @type {Client}
     */
    this.client = voiceManager.client;

    /**
     * The voice channel this connection is currently serving
     * @type {VoiceChannel}
     */
    this.channel = channel;

    /**
     * The current status of the voice connection
     * @type {VoiceStatus}
     */
    this.status = VoiceStatus.AUTHENTICATING;

    /**
     * Whether we're currently transmitting audio
     * @type {boolean}
     */
    this.speaking = false;

    /**
     * An array of Voice Receivers that have been created for this connection
     * @type {VoiceReceiver[]}
     */
    this.receivers = [];

    /**
     * The authentication data needed to connect to the voice server
     * @type {Object}
     * @private
     */
    this.authentication = {};

    /**
     * The audio player for this voice connection
     * @type {AudioPlayer}
     */
    this.player = new AudioPlayer(this);

    this.player.on('debug', m => {
      /**
       * Debug info from the connection.
       * @event VoiceConnection#debug
       * @param {string} message The debug message
       */
      this.emit('debug', `audio player - ${m}`);
    });

    this.player.on('error', e => {
      /**
       * Warning info from the connection.
       * @event VoiceConnection#warn
       * @param {string|Error} warning The warning
       */
      this.emit('warn', e);
    });

    this.once('closing', () => this.player.destroy());

    /**
     * Map SSRC to speaking values
     * @type {Map<number, boolean>}
     * @private
     */
    this.ssrcMap = new Map();

    /**
     * Object that wraps contains the `ws` and `udp` sockets of this voice connection
     * @type {Object}
     * @private
     */
    this.sockets = {};

    this.authenticate();
  }

  /**
   * The current stream dispatcher (if any)
   * @type {?StreamDispatcher}
   * @readonly
   */
  get dispatcher() {
    return this.player.dispatcher;
  }

  /**
   * Sets whether the voice connection should display as "speaking" or not.
   * @param {boolean} value Whether or not to speak
   * @private
   */
  setSpeaking(value) {
    if (this.speaking === value) return;
    if (this.status !== VoiceStatus.CONNECTED) return;
    this.speaking = value;
    this.sockets.ws.sendPacket({
      op: VoiceOPCodes.SPEAKING,
      d: {
        speaking: this.speaking,
        delay: 0,
        ssrc: this.authentication.ssrc,
      },
    }).catch(e => {
      this.emit('debug', e);
    });
  }

  /**
   * Sends a request to the main gateway to join a voice channel.
   * @param {Object} [options] The options to provide
   * @private
   */
  sendVoiceStateUpdate(options = {}) {
    options = Util.mergeDefault({
      guild_id: this.channel.guild.id,
      channel_id: this.channel.id,
      self_mute: false,
      self_deaf: false,
    }, options);

    this.client.ws.send({
      op: OPCodes.VOICE_STATE_UPDATE,
      d: options,
    });
  }

  /**
   * Set the token and endpoint required to connect to the voice servers.
   * @param {string} token The voice token
   * @param {string} endpoint The voice endpoint
   * @private
   * @returns {void}
   */
  setTokenAndEndpoint(token, endpoint) {
    if (!endpoint) {
      // Signifies awaiting endpoint stage
      return;
    }

    if (!token) {
      this.authenticateFailed('VOICE_TOKEN_ABSENT');
      return;
    }

    endpoint = endpoint.match(/([^:]*)/)[0];

    if (!endpoint) {
      this.authenticateFailed('VOICE_INVALID_ENDPOINT');
      return;
    }

    if (this.status === VoiceStatus.AUTHENTICATING) {
      this.authentication.token = token;
      this.authentication.endpoint = endpoint;
      this.checkAuthenticated();
    } else if (token !== this.authentication.token || endpoint !== this.authentication.endpoint) {
      this.reconnect(token, endpoint);
    }
  }

  /**
   * Sets the Session ID for the connection.
   * @param {string} sessionID The voice session ID
   * @private
   */
  setSessionID(sessionID) {
    if (!sessionID) {
      this.authenticateFailed('VOICE_SESSION_ABSENT');
      return;
    }

    if (this.status === VoiceStatus.AUTHENTICATING) {
      this.authentication.sessionID = sessionID;
      this.checkAuthenticated();
    } else if (sessionID !== this.authentication.sessionID) {
      this.authentication.sessionID = sessionID;
      /**
       * Emitted when a new session ID is received.
       * @event VoiceConnection#newSession
       * @private
       */
      this.emit('newSession', sessionID);
    }
  }

  /**
   * Checks whether the voice connection is authenticated.
   * @private
   */
  checkAuthenticated() {
    const { token, endpoint, sessionID } = this.authentication;

    if (token && endpoint && sessionID) {
      clearTimeout(this.connectTimeout);
      this.status = VoiceStatus.CONNECTING;
      /**
       * Emitted when we successfully initiate a voice connection.
       * @event VoiceConnection#authenticated
       */
      this.emit('authenticated');
      this.connect();
    }
  }

  /**
   * Invoked when we fail to initiate a voice connection.
   * @param {string} reason The reason for failure
   * @private
   */
  authenticateFailed(reason) {
    clearTimeout(this.connectTimeout);
    if (this.status === VoiceStatus.AUTHENTICATING) {
      /**
       * Emitted when we fail to initiate a voice connection.
       * @event VoiceConnection#failed
       * @param {Error} error The encountered error
       */
      this.emit('failed', new Error(reason));
    } else {
      this.emit('error', new Error(reason));
    }
    this.status = VoiceStatus.DISCONNECTED;
  }

  /**
   * Move to a different voice channel in the same guild.
   * @param {VoiceChannel} channel The channel to move to
   * @private
   */
  updateChannel(channel) {
    this.channel = channel;
    this.sendVoiceStateUpdate();
  }

  /**
   * Attempts to authenticate to the voice server.
   * @private
   */
  authenticate() {
    this.sendVoiceStateUpdate();
    this.connectTimeout = this.client.setTimeout(
      () => this.authenticateFailed('VOICE_CONNECTION_TIMEOUT'), 15000);
  }

  /**
   * Attempts to reconnect to the voice server (typically after a region change).
   * @param {string} token The voice token
   * @param {string} endpoint The voice endpoint
   * @private
   */
  reconnect(token, endpoint) {
    this.authentication.token = token;
    this.authentication.endpoint = endpoint;
    this.speaking = false;
    this.status = VoiceStatus.RECONNECTING;
    /**
     * Emitted when the voice connection is reconnecting (typically after a region change).
     * @event VoiceConnection#reconnecting
     */
    this.emit('reconnecting');
    this.connect();
  }

  /**
   * Disconnects the voice connection, causing a disconnect and closing event to be emitted.
   */
  disconnect() {
    this.emit('closing');
    clearTimeout(this.connectTimeout);
    const conn = this.voiceManager.connections.get(this.channel.guild.id);
    if (conn === this) this.voiceManager.connections.delete(this.channel.guild.id);
    this.sendVoiceStateUpdate({
      channel_id: null,
    });
    this._disconnect();
  }

  /**
   * Internally disconnects (doesn't send disconnect packet).
   * @private
   */
  _disconnect() {
    this.cleanup();
    this.status = VoiceStatus.DISCONNECTED;
    /**
     * Emitted when the voice connection disconnects.
     * @event VoiceConnection#disconnect
     */
    this.emit('disconnect');
  }


  /**
   * Cleans up after disconnect.
   * @private
   */
  cleanup() {
    this.player.destroy();
    this.speaking = false;
    const { ws, udp } = this.sockets;

    if (ws) {
      ws.removeAllListeners('error');
      ws.removeAllListeners('ready');
      ws.removeAllListeners('sessionDescription');
      ws.removeAllListeners('speaking');
    }

    if (udp) udp.removeAllListeners('error');

    this.sockets.ws = null;
    this.sockets.udp = null;
  }

  /**
   * Connect the voice connection.
   * @private
   */
  connect() {
    if (this.status !== VoiceStatus.RECONNECTING) {
      if (this.sockets.ws) throw new Error('WS_CONNECTION_EXISTS');
      if (this.sockets.udp) throw new Error('UDP_CONNECTION_EXISTS');
    }

    if (this.sockets.ws) this.sockets.ws.shutdown();
    if (this.sockets.udp) this.sockets.udp.shutdown();

    this.sockets.ws = new VoiceWebSocket(this);
    this.sockets.udp = new VoiceUDP(this);

    const { ws, udp } = this.sockets;

    ws.on('error', err => this.emit('error', err));
    udp.on('error', err => this.emit('error', err));
    ws.on('ready', this.onReady.bind(this));
    ws.on('sessionDescription', this.onSessionDescription.bind(this));
    ws.on('speaking', this.onSpeaking.bind(this));
  }

  /**
   * Invoked when the voice websocket is ready.
   * @param {Object} data The received data
   * @private
   */
  onReady({ port, ssrc }) {
    this.authentication.port = port;
    this.authentication.ssrc = ssrc;

    const udp = this.sockets.udp;
    /**
     * Emitted whenever the connection encounters an error.
     * @event VoiceConnection#error
     * @param {Error} error The encountered error
     */
    udp.findEndpointAddress()
      .then(address => {
        udp.createUDPSocket(address);
      }, e => this.emit('error', e));
  }

  /**
   * Invoked when a session description is received.
   * @param {string} mode The encryption mode
   * @param {string} secret The secret key
   * @private
   */
  onSessionDescription(mode, secret) {
    this.authentication.encryptionMode = mode;
    this.authentication.secretKey = secret;

    this.status = VoiceStatus.CONNECTED;
    /**
     * Emitted once the connection is ready, when a promise to join a voice channel resolves,
     * the connection will already be ready.
     * @event VoiceConnection#ready
     */
    this.emit('ready');
  }

  /**
   * Invoked when a speaking event is received.
   * @param {Object} data The received data
   * @private
   */
  onSpeaking({ user_id, ssrc, speaking }) {
    const guild = this.channel.guild;
    const user = this.client.users.get(user_id);
    this.ssrcMap.set(+ssrc, user);
    /**
     * Emitted whenever a user starts/stops speaking.
     * @event VoiceConnection#speaking
     * @param {User} user The user that has started/stopped speaking
     * @param {boolean} speaking Whether or not the user is speaking
     */
    if (this.status === VoiceStatus.CONNECTED) {
      this.emit('speaking', user, speaking);
      if (!speaking) {
        for (const receiver of this.receivers) {
          receiver.packets._stoppedSpeaking(user_id);
        }
      }
    }
    guild._memberSpeakUpdate(user_id, speaking);
  }

  /**
   * Creates a VoiceReceiver so you can start listening to voice data.
   * It's recommended to only create one of these.
   * @returns {VoiceReceiver}
   */
  createReceiver() {
    const receiver = new VoiceReceiver(this);
    this.receivers.push(receiver);
    return receiver;
  }

  play() {} // eslint-disable-line no-empty-function
}

PlayInterface.applyToClass(VoiceConnection);

module.exports = VoiceConnection;
