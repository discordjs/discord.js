'use strict';

const EventEmitter = require('events');
const VoiceUDP = require('./networking/VoiceUDPClient');
const VoiceWebSocket = require('./networking/VoiceWebSocket');
const AudioPlayer = require('./player/AudioPlayer');
const VoiceReceiver = require('./receiver/Receiver');
const PlayInterface = require('./util/PlayInterface');
const Silence = require('./util/Silence');
const { Error } = require('../../errors');
const { OPCodes, VoiceOPCodes, VoiceStatus, Events } = require('../../util/Constants');
const Speaking = require('../../util/Speaking');
const Util = require('../../util/Util');

// Workaround for Discord now requiring silence to be sent before being able to receive audio
class SingleSilence extends Silence {
  _read() {
    super._read();
    this.push(null);
  }
}

const SUPPORTED_MODES = ['xsalsa20_poly1305_lite', 'xsalsa20_poly1305_suffix', 'xsalsa20_poly1305'];

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
     * Our current speaking state
     * @type {Readonly<Speaking>}
     */
    this.speaking = new Speaking().freeze();

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
     * Map SSRC values to user IDs
     * @type {Map<number, Snowflake>}
     * @private
     */
    this.ssrcMap = new Map();

    /**
     * Tracks which users are talking
     * @type {Map<Snowflake, Readonly<Speaking>>}
     * @private
     */
    this._speaking = new Map();

    /**
     * Object that wraps contains the `ws` and `udp` sockets of this voice connection
     * @type {Object}
     * @private
     */
    this.sockets = {};

    /**
     * The voice receiver of this connection
     * @type {VoiceReceiver}
     */
    this.receiver = new VoiceReceiver(this);
  }

  /**
   * The client that instantiated this connection
   * @type {Client}
   * @readonly
   */
  get client() {
    return this.voiceManager.client;
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
   * Sets whether the voice connection should display as "speaking", "soundshare" or "none".
   * @param {BitFieldResolvable} value The new speaking state
   */
  setSpeaking(value) {
    if (this.speaking.equals(value)) return;
    if (this.status !== VoiceStatus.CONNECTED) return;
    this.speaking = new Speaking(value).freeze();
    this.sockets.ws
      .sendPacket({
        op: VoiceOPCodes.SPEAKING,
        d: {
          speaking: this.speaking.bitfield,
          delay: 0,
          ssrc: this.authentication.ssrc,
        },
      })
      .catch(e => {
        this.emit('debug', e);
      });
  }

  /**
   * The voice state of this connection
   * @type {?VoiceState}
   */
  get voice() {
    return this.channel.guild.voice;
  }

  /**
   * Sends a request to the main gateway to join a voice channel.
   * @param {Object} [options] The options to provide
   * @returns {Promise<Shard>}
   * @private
   */
  sendVoiceStateUpdate(options = {}) {
    options = Util.mergeDefault(
      {
        guild_id: this.channel.guild.id,
        channel_id: this.channel.id,
        self_mute: this.voice ? this.voice.selfMute : false,
        self_deaf: this.voice ? this.voice.selfDeaf : false,
      },
      options,
    );

    this.emit('debug', `Sending voice state update: ${JSON.stringify(options)}`);

    return this.channel.guild.shard.send(
      {
        op: OPCodes.VOICE_STATE_UPDATE,
        d: options,
      },
      true,
    );
  }

  /**
   * Set the token and endpoint required to connect to the voice servers.
   * @param {string} token The voice token
   * @param {string} endpoint The voice endpoint
   * @returns {void}
   * @private
   */
  setTokenAndEndpoint(token, endpoint) {
    this.emit('debug', `Token "${token}" and endpoint "${endpoint}"`);
    if (!endpoint) {
      // Signifies awaiting endpoint stage
      return;
    }

    if (!token) {
      this.authenticateFailed('VOICE_TOKEN_ABSENT');
      return;
    }

    endpoint = endpoint.match(/([^:]*)/)[0];
    this.emit('debug', `Endpoint resolved as ${endpoint}`);

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
    this.emit('debug', `Setting sessionID ${sessionID} (stored as "${this.authentication.sessionID}")`);
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
    this.emit('debug', `Authenticated with sessionID ${sessionID}`);
    if (token && endpoint && sessionID) {
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
    this.client.clearTimeout(this.connectTimeout);
    this.emit('debug', `Authenticate failed - ${reason}`);
    if (this.status === VoiceStatus.AUTHENTICATING) {
      /**
       * Emitted when we fail to initiate a voice connection.
       * @event VoiceConnection#failed
       * @param {Error} error The encountered error
       */
      this.emit('failed', new Error(reason));
    } else {
      /**
       * Emitted whenever the connection encounters an error.
       * @event VoiceConnection#error
       * @param {Error} error The encountered error
       */
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
    this.connectTimeout = this.client.setTimeout(() => this.authenticateFailed('VOICE_CONNECTION_TIMEOUT'), 15000);
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
    this.speaking = new Speaking().freeze();
    this.status = VoiceStatus.RECONNECTING;
    this.emit('debug', `Reconnecting to ${endpoint}`);
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
    this.emit('debug', 'disconnect() triggered');
    this.client.clearTimeout(this.connectTimeout);
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
    this.speaking = new Speaking().freeze();
    const { ws, udp } = this.sockets;

    this.emit('debug', 'Connection clean up');

    if (ws) {
      ws.removeAllListeners('error');
      ws.removeAllListeners('ready');
      ws.removeAllListeners('sessionDescription');
      ws.removeAllListeners('speaking');
      ws.shutdown();
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
    this.emit('debug', `Connect triggered`);
    if (this.status !== VoiceStatus.RECONNECTING) {
      if (this.sockets.ws) throw new Error('WS_CONNECTION_EXISTS');
      if (this.sockets.udp) throw new Error('UDP_CONNECTION_EXISTS');
    }

    if (this.sockets.ws) this.sockets.ws.shutdown();
    if (this.sockets.udp) this.sockets.udp.shutdown();

    this.sockets.ws = new VoiceWebSocket(this);
    this.sockets.udp = new VoiceUDP(this);

    const { ws, udp } = this.sockets;

    ws.on('debug', msg => this.emit('debug', msg));
    udp.on('debug', msg => this.emit('debug', msg));
    ws.on('error', err => this.emit('error', err));
    udp.on('error', err => this.emit('error', err));
    ws.on('ready', this.onReady.bind(this));
    ws.on('sessionDescription', this.onSessionDescription.bind(this));
    ws.on('startSpeaking', this.onStartSpeaking.bind(this));

    this.sockets.ws.connect();
  }

  /**
   * Invoked when the voice websocket is ready.
   * @param {Object} data The received data
   * @private
   */
  onReady(data) {
    Object.assign(this.authentication, data);
    for (let mode of data.modes) {
      if (SUPPORTED_MODES.includes(mode)) {
        this.authentication.mode = mode;
        this.emit('debug', `Selecting the ${mode} mode`);
        break;
      }
    }
    this.sockets.udp.createUDPSocket(data.ip);
  }

  /**
   * Invoked when a session description is received.
   * @param {Object} data The received data
   * @private
   */
  onSessionDescription(data) {
    Object.assign(this.authentication, data);
    this.status = VoiceStatus.CONNECTED;
    const ready = () => {
      this.client.clearTimeout(this.connectTimeout);
      this.emit('debug', `Ready with authentication details: ${JSON.stringify(this.authentication)}`);
      /**
       * Emitted once the connection is ready, when a promise to join a voice channel resolves,
       * the connection will already be ready.
       * @event VoiceConnection#ready
       */
      this.emit('ready');
    };
    if (this.dispatcher) {
      ready();
    } else {
      // This serves to provide support for voice receive, sending audio is required to receive it.
      const dispatcher = this.play(new SingleSilence(), { type: 'opus', volume: false });
      dispatcher.once('finish', ready);
    }
  }

  onStartSpeaking({ user_id, ssrc, speaking }) {
    this.ssrcMap.set(+ssrc, {
      ...(this.ssrcMap.get(+ssrc) || {}),
      userID: user_id,
      speaking: speaking,
    });
  }

  /**
   * Invoked when a speaking event is received.
   * @param {Object} data The received data
   * @private
   */
  onSpeaking({ user_id, speaking }) {
    speaking = new Speaking(speaking).freeze();
    const guild = this.channel.guild;
    const user = this.client.users.cache.get(user_id);
    const old = this._speaking.get(user_id);
    this._speaking.set(user_id, speaking);
    /**
     * Emitted whenever a user changes speaking state.
     * @event VoiceConnection#speaking
     * @param {User} user The user that has changed speaking state
     * @param {Readonly<Speaking>} speaking The speaking state of the user
     */
    if (this.status === VoiceStatus.CONNECTED) {
      this.emit('speaking', user, speaking);
      if (!speaking.has(Speaking.FLAGS.SPEAKING)) {
        this.receiver.packets._stoppedSpeaking(user_id);
      }
    }

    if (guild && user && !speaking.equals(old)) {
      const member = guild.member(user);
      if (member) {
        /**
         * Emitted once a guild member changes speaking state.
         * @event Client#guildMemberSpeaking
         * @param {GuildMember} member The member that started/stopped speaking
         * @param {Readonly<Speaking>} speaking The speaking state of the member
         */
        this.client.emit(Events.GUILD_MEMBER_SPEAKING, member, speaking);
      }
    }
  }

  play() {} // eslint-disable-line no-empty-function
}

PlayInterface.applyToClass(VoiceConnection);

module.exports = VoiceConnection;
