const VoiceConnectionWebSocket = require('./VoiceConnectionWebSocket');
const VoiceConnectionUDPClient = require('./VoiceConnectionUDPClient');
const VoiceReceiver = require('./receiver/VoiceReceiver');
const Constants = require('../../util/Constants');
const EventEmitter = require('events').EventEmitter;
const DefaultPlayer = require('./player/DefaultPlayer');

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
     * The player
     * @type {BasePlayer}
     */
    this.player = new DefaultPlayer(this);
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
    this.ssrcMap = new Map();
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
    /**
     * Emitted whenever the connection encounters a fatal error.
     * @event VoiceConnection#error
     * @param {Error} error the encountered error
     */
    this.emit('error', e);
    this._shutdown(e);
  }

  /**
   * Disconnects the Client from the Voice Channel
   * @param {string} [reason='user requested'] the reason of the disconnection
   * @returns {null}
   */
  disconnect(reason = 'user requested') {
    this.manager.client.ws.send({
      op: Constants.OPCodes.VOICE_STATE_UPDATE,
      d: {
        guild_id: this.channel.guild.id,
        channel_id: null,
        self_mute: false,
        self_deaf: false,
      },
    });
    return this._shutdown(reason);
  }

  _onClose(e) {
    e = e && e.code === 1000 ? null : e;
    return this._shutdown(e);
  }

  _shutdown(e) {
    if (!this.ready) {
      return;
    }
    this.ready = false;
    this.websocket._shutdown();
    this.player._shutdown();
    if (this.udp) {
      this.udp._shutdown();
    }
    /**
     * Emit once the voice connection has disconnected.
     * @event VoiceConnection#disconnected
     * @param {Error} error the error, if any
     */
    this.emit('disconnected', e);
  }

  /**
   * Binds listeners to the WebSocket and UDP sub-clients
   * @returns {null}
   * @private
   */
  bindListeners() {
    this.websocket.on('error', err => this._onError(err));
    this.websocket.on('close', err => this._onClose(err));
    this.websocket.on('ready-for-udp', data => {
      this.udp = new VoiceConnectionUDPClient(this, data);
      this.data = data;
      this.udp.on('error', err => this._onError(err));
      this.udp.on('close', err => this._onClose(err));
    });
    this.websocket.on('ready', secretKey => {
      this.data.secret = secretKey;
      this.ready = true;
      /**
       * Emitted once the connection is ready (joining voice channels resolves when the connection is ready anyway)
       * @event VoiceConnection#ready
       */
      this.emit('ready');
      this._resolve(this);
    });
    this.websocket.on('speaking', data => {
      const guild = this.channel.guild;
      this.ssrcMap.set(+data.ssrc, this.manager.client.users.get(data.user_id));
      guild._memberSpeakUpdate(data.user_id, data.speaking);
    });
  }

  /**
   * Play the given file in the voice connection
   * @param {String} filepath the path to the file
   * @returns {StreamDispatcher}
   * @example
   * // play files natively
   * voiceChannel.join()
   *  .then(connection => {
   *    const dispatcher = connection.playFile('C:/Users/Discord/Desktop/music.mp3');
   *  })
   *  .catch(console.log);
   */
  playFile(file) {
    return this.player.playFile(file);
  }

  /**
   * Play the given stream in the voice connection
   * @param {ReadableStream} stream the audio stream to play
   * @returns {StreamDispatcher}
   * @example
   * // play streams using ytdl-core
   * const ytdl = require('ytdl-core');
   * voiceChannel.join()
   *  .then(connection => {
   *    const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', {filter : 'audioonly'});
   *    const dispatcher = connection.playStream(stream);
   *  })
   *  .catch(console.log);
   */
  playStream(stream) {
    return this.player.playStream(stream);
  }

  /**
   * Creates a VoiceReceiver so you can start listening to voice data. It's recommended to only create one of these.
   * @returns {VoiceReceiver}
   */
  createReceiver() {
    return new VoiceReceiver(this);
  }
}

module.exports = VoiceConnection;
