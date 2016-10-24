const VoiceWebSocket = require('./VoiceWebSocket');
const VoiceUDP = require('./VoiceUDPClient');
const VoiceReceiver = require('./receiver/VoiceReceiver');
const Constants = require('../../util/Constants');
const AudioPlayer = require('./player/AudioPlayer');
const EventEmitter = require('events').EventEmitter;

/**
 * Represents a connection to a Voice Channel in Discord.
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
     * The authentication data needed to connect to the voice server
     * @type {object}
     */
    this.authentication = pendingConnection.data;

    this.player = new AudioPlayer(this);

    this.player.on('error', e => {
      this.emit('warn', e);
      this.player.cleanup();
    });

    /**
     * Object that wraps contains the `ws` and `udp` sockets of this voice connection
     * @type {object}
     */
    this.sockets = {};
    this.connect();
  }

  setSpeaking(value) {
    if (this.speaking === value) return;
    this.speaking = value;
    this.sockets.ws.sendPacket({
      op: Constants.VoiceOPCodes.SPEAKING,
      d: {
        speaking: true,
        delay: 0,
      },
    });
  }

  connect() {
    if (this.sockets.ws) {
      throw new Error('There is already an existing WebSocket connection!');
    }
    if (this.sockets.udp) {
      throw new Error('There is already an existing UDP connection!');
    }
    this.sockets.ws = new VoiceWebSocket(this);
    this.sockets.udp = new VoiceUDP(this);
    this.sockets.ws.on('error', e => this.emit('error', e));
    this.sockets.udp.on('error', e => this.emit('error', e));
    this.sockets.ws.once('ready', d => {
      this.authentication.port = d.port;
      this.authentication.ssrc = d.ssrc;
      this.sockets.udp.findEndpointAddress()
        .then(address => {
          this.sockets.udp.createUDPSocket(address);
        })
        .catch(e => this.emit('error', e));
    });
    this.sockets.ws.once('sessionDescription', (mode, secret) => {
      this.authentication.encryptionMode = mode;
      this.authentication.secretKey = secret;
      this.emit('ready');
    });
  }

}

module.exports = VoiceConnection;
