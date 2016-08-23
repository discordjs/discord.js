const VoiceConnectionWebSocket = require('./VoiceConnectionWebSocket');
const VoiceConnectionUDPClient = require('./VoiceConnectionUDPClient');
const EventEmitter = require('events').EventEmitter;

/**
 * Represents a connection to a Voice Channel in Discord
 * @extends {EventEmitter}
 */
class VoiceConnection extends EventEmitter {
  constructor(manager, channel, token, sessionID, endpoint, resolve, reject) {
    super();
    /**
     * The voice manager of this connection
     * @type {ClientVoiceManager}
     * @private
     */
    this.manager = manager;
    /**
     * The endpoint of the connection
     * @type {String}
     */
    this.endpoint = endpoint;
    /**
     * The VoiceChannel for this connection
     * @type {VoiceChannel}
     */
    this.channel = channel;
    /**
     * The WebSocket connection for this voice connection
     * @type {VoiceConnectionWebSocket}
     * @private
     */
    this.websocket = new VoiceConnectionWebSocket(this, channel.guild.id, token, sessionID, endpoint);
    /**
     * Whether or not the connection is ready
     * @type {Boolean}
     */
    this.ready = false;
    /**
     * The resolve function for the promise associated with creating this connection
     * @type {Function}
     * @private
     */
    this._resolve = resolve;
    /**
     * The reject function for the promise associated with creating this connection
     * @type {Function}
     * @private
     */
    this._reject = reject;
    this.bindListeners();
  }

  /**
   * Executed whenever an error occurs with the UDP/WebSocket sub-client
   * @private
   * @param {Error} error
   * @returns {null}
   */
  _onError(e) {
    this._reject(e);
    this.emit('error', e);
  }

  /**
   * Binds listeners to the WebSocket and UDP sub-clients
   * @returns {null}
   * @private
   */
  bindListeners() {
    this.websocket.on('error', err => this._onError(err));
    this.websocket.on('ready-for-udp', data => {
      this.udp = new VoiceConnectionUDPClient(this, data);
      this.udp.on('error', err => this._onError(err));
    });
    this.websocket.on('ready', () => {
      this.ready = true;
      this.emit('ready');
      this._resolve(this);
    });
  }
}

module.exports = VoiceConnection;
