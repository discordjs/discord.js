const VoiceWebSocket = require('./VoiceConnectionWebSocket');
const VoiceUDP = require('./VoiceConnectionUDPClient');
const VoiceReceiver = require('./receiver/VoiceReceiver');
const Constants = require('../../util/Constants');
const EventEmitter = require('events').EventEmitter;
const DefaultPlayer = require('./player/DefaultPlayer');

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

    /**
     * Object that wraps contains the `ws` and `udp` sockets of this voice connection
     * @type {object}
     */
    this.sockets = {};
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
  }

}

module.exports = VoiceConnection;
