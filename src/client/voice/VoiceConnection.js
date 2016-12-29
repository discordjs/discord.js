const VoiceWebSocket = require('./VoiceWebSocket');
const VoiceUDP = require('./VoiceUDPClient');
const Constants = require('../../util/Constants');
const AudioPlayer = require('./player/AudioPlayer');
const VoiceReceiver = require('./receiver/VoiceReceiver');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

/**
 * Represents a connection to a voice channel in Discord.
 * ```js
 * // obtained using:
 * voiceChannel.join().then(connection => {
 *
 * });
 * ```
 * @extends {EventEmitter}
 */
class VoiceConnection extends EventEmitter {
  constructor(pendingConnection) {
    super();

    /**
     * The Voice Manager that instantiated this connection
     * @type {ClientVoiceManager}
     */
    this.voiceManager = pendingConnection.voiceManager;

    /**
     * The voice channel this connection is currently serving
     * @type {VoiceChannel}
     */
    this.channel = pendingConnection.channel;

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
    this.authentication = pendingConnection.data;

    /**
     * The audio player for this voice connection
     * @type {AudioPlayer}
     */
    this.player = new AudioPlayer(this);

    this.player.on('debug', m => {
      /**
       * Debug info from the connection
       * @event VoiceConnection#debug
       * @param {string} message the debug message
       */
      this.emit('debug', `audio player - ${m}`);
    });

    this.player.on('error', e => {
      /**
       * Warning info from the connection
       * @event VoiceConnection#warn
       * @param {string|Error} warning the warning
       */
      this.emit('warn', e);
      this.player.cleanup();
    });

    /**
     * Map SSRC to speaking values
     * @type {Map<number, boolean>}
     * @private
     */
    this.ssrcMap = new Map();

    /**
     * Whether this connection is ready
     * @type {boolean}
     * @private
     */
    this.ready = false;

    /**
     * Object that wraps contains the `ws` and `udp` sockets of this voice connection
     * @type {Object}
     * @private
     */
    this.sockets = {};
    this.connect();
  }

  /**
   * Sets whether the voice connection should display as "speaking" or not
   * @param {boolean} value whether or not to speak
   * @private
   */
  setSpeaking(value) {
    if (this.speaking === value) return;
    this.speaking = value;
    this.sockets.ws.sendPacket({
      op: Constants.VoiceOPCodes.SPEAKING,
      d: {
        speaking: true,
        delay: 0,
      },
    }).catch(e => {
      this.emit('debug', e);
    });
  }

  /**
   * Disconnect the voice connection, causing a disconnect and closing event to be emitted.
   */
  disconnect() {
    this.emit('closing');
    this.voiceManager.client.ws.send({
      op: Constants.OPCodes.VOICE_STATE_UPDATE,
      d: {
        guild_id: this.channel.guild.id,
        channel_id: null,
        self_mute: false,
        self_deaf: false,
      },
    });
    /**
     * Emitted when the voice connection disconnects
     * @event VoiceConnection#disconnect
     */
    this.emit('disconnect');
  }

  /**
   * Connect the voice connection
   * @private
   */
  connect() {
    if (this.sockets.ws) throw new Error('There is already an existing WebSocket connection.');
    if (this.sockets.udp) throw new Error('There is already an existing UDP connection.');
    this.sockets.ws = new VoiceWebSocket(this);
    this.sockets.udp = new VoiceUDP(this);
    this.sockets.ws.on('error', e => this.emit('error', e));
    this.sockets.udp.on('error', e => this.emit('error', e));
    this.sockets.ws.once('ready', d => {
      this.authentication.port = d.port;
      this.authentication.ssrc = d.ssrc;
      /**
       * Emitted whenever the connection encounters an error.
       * @event VoiceConnection#error
       * @param {Error} error the encountered error
       */
      this.sockets.udp.findEndpointAddress()
        .then(address => {
          this.sockets.udp.createUDPSocket(address);
        }, e => this.emit('error', e));
    });
    this.sockets.ws.once('sessionDescription', (mode, secret) => {
      this.authentication.encryptionMode = mode;
      this.authentication.secretKey = secret;
      /**
       * Emitted once the connection is ready, when a promise to join a voice channel resolves,
       * the connection will already be ready.
       * @event VoiceConnection#ready
       */
      this.emit('ready');
      this.ready = true;
    });
    this.sockets.ws.on('speaking', data => {
      const guild = this.channel.guild;
      const user = this.voiceManager.client.users.get(data.user_id);
      this.ssrcMap.set(+data.ssrc, user);
      if (!data.speaking) {
        for (const receiver of this.receivers) {
          const opusStream = receiver.opusStreams.get(user.id);
          const pcmStream = receiver.pcmStreams.get(user.id);
          if (opusStream) {
            opusStream.push(null);
            opusStream.open = false;
            receiver.opusStreams.delete(user.id);
          }
          if (pcmStream) {
            pcmStream.push(null);
            pcmStream.open = false;
            receiver.pcmStreams.delete(user.id);
          }
        }
      }
      /**
       * Emitted whenever a user starts/stops speaking
       * @event VoiceConnection#speaking
       * @param {User} user The user that has started/stopped speaking
       * @param {boolean} speaking Whether or not the user is speaking
       */
      if (this.ready) this.emit('speaking', user, data.speaking);
      guild._memberSpeakUpdate(data.user_id, data.speaking);
    });
  }

  /**
   * Options that can be passed to stream-playing methods:
   * @typedef {Object} StreamOptions
   * @property {number} [seek=0] The time to seek to
   * @property {number} [volume=1] The volume to play at
   * @property {number} [passes=1] How many times to send the voice packet to reduce packet loss
   */

  /**
   * Play the given file in the voice connection.
   * @param {string} file The path to the file
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {StreamDispatcher}
   * @example
   * // play files natively
   * voiceChannel.join()
   *  .then(connection => {
   *    const dispatcher = connection.playFile('C:/Users/Discord/Desktop/music.mp3');
   *  })
   *  .catch(console.error);
   */
  playFile(file, options) {
    return this.playStream(fs.createReadStream(file), options);
  }

  /**
   * Plays and converts an audio stream in the voice connection.
   * @param {ReadableStream} stream The audio stream to play
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {StreamDispatcher}
   * @example
   * // play streams using ytdl-core
   * const ytdl = require('ytdl-core');
   * const streamOptions = { seek: 0, volume: 1 };
   * voiceChannel.join()
   *  .then(connection => {
   *    const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', {filter : 'audioonly'});
   *    const dispatcher = connection.playStream(stream, streamOptions);
   *  })
   *  .catch(console.error);
   */
  playStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    return this.player.playUnknownStream(stream, options);
  }

  /**
   * Plays a stream of 16-bit signed stereo PCM at 48KHz.
   * @param {ReadableStream} stream The audio stream to play.
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {StreamDispatcher}
   */
  playConvertedStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    return this.player.playPCMStream(stream, null, options);
  }

  /**
   * Creates a VoiceReceiver so you can start listening to voice data. It's recommended to only create one of these.
   * @returns {VoiceReceiver}
   */
  createReceiver() {
    const receiver = new VoiceReceiver(this);
    this.receivers.push(receiver);
    return receiver;
  }
}

module.exports = VoiceConnection;
