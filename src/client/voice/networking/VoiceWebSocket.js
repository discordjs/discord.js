'use strict';

const { OPCodes, VoiceOPCodes } = require('../../../util/Constants');
const EventEmitter = require('events');
const { Error } = require('../../../errors');
const WebSocket = require('../../../WebSocket');

/**
 * Represents a Voice Connection's WebSocket.
 * @extends {EventEmitter}
 * @private
 */
class VoiceWebSocket extends EventEmitter {
  constructor(connection) {
    super();
    /**
     * The Voice Connection that this WebSocket serves
     * @type {VoiceConnection}
     */
    this.connection = connection;

    /**
     * How many connection attempts have been made
     * @type {number}
     */
    this.attempts = 0;

    this.dead = false;
    this.connection.on('closing', this.shutdown.bind(this));
  }

  /**
   * The client of this voice WebSocket
   * @type {Client}
   * @readonly
   */
  get client() {
    return this.connection.voiceManager.client;
  }

  shutdown() {
    this.emit('debug', `[WS] shutdown requested`);
    this.dead = true;
    this.reset();
  }

  /**
   * Resets the current WebSocket.
   */
  reset() {
    this.emit('debug', `[WS] reset requested`);
    if (this.ws) {
      if (this.ws.readyState !== WebSocket.CLOSED) this.ws.close();
      this.ws = null;
    }
    this.clearHeartbeat();
  }

  /**
   * Starts connecting to the Voice WebSocket Server.
   */
  connect() {
    this.emit('debug', `[WS] connect requested`);
    if (this.dead) return;
    if (this.ws) this.reset();
    if (this.attempts >= 5) {
      this.emit('debug', new Error('VOICE_CONNECTION_ATTEMPTS_EXCEEDED', this.attempts));
      return;
    }

    this.attempts++;

    /**
     * The actual WebSocket used to connect to the Voice WebSocket Server.
     * @type {WebSocket}
     */
    this.ws = WebSocket.create(`wss://${this.connection.authentication.endpoint}/`, { v: 4 });
    this.emit('debug', `[WS] connecting, ${this.attempts} attempts, ${this.ws.url}`);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  /**
   * Sends data to the WebSocket if it is open.
   * @param {string} data The data to send to the WebSocket
   * @returns {Promise<string>}
   */
  send(data) {
    this.emit('debug', `[WS] >> ${data}`);
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) throw new Error('WS_NOT_OPEN', data);
      this.ws.send(data, null, error => {
        if (error) reject(error); else resolve(data);
      });
    });
  }

  /**
   * JSON.stringify's a packet and then sends it to the WebSocket Server.
   * @param {Object} packet The packet to send
   * @returns {Promise<string>}
   */
  sendPacket(packet) {
    try {
      packet = JSON.stringify(packet);
    } catch (error) {
      return Promise.reject(error);
    }
    return this.send(packet);
  }

  /**
   * Called whenever the WebSocket opens.
   */
  onOpen() {
    this.emit('debug', `[WS] opened at gateway ${this.connection.authentication.endpoint}`);
    this.sendPacket({
      op: OPCodes.DISPATCH,
      d: {
        server_id: this.connection.channel.guild.id,
        user_id: this.client.user.id,
        token: this.connection.authentication.token,
        session_id: this.connection.authentication.sessionID,
      },
    }).catch(() => {
      this.emit('error', new Error('VOICE_JOIN_SOCKET_CLOSED'));
    });
  }

  /**
   * Called whenever a message is received from the WebSocket.
   * @param {MessageEvent} event The message event that was received
   * @returns {void}
   */
  onMessage(event) {
    try {
      return this.onPacket(WebSocket.unpack(event.data, 'json'));
    } catch (error) {
      return this.onError(error);
    }
  }

  /**
   * Called whenever the connection to the WebSocket server is lost.
   */
  onClose() {
    this.emit('debug', `[WS] closed`);
    if (!this.dead) this.client.setTimeout(this.connect.bind(this), this.attempts * 1000);
  }

  /**
   * Called whenever an error occurs with the WebSocket.
   * @param {Error} error The error that occurred
   */
  onError(error) {
    this.emit('debug', `[WS] Error: ${error}`);
    this.emit('error', error);
  }

  /**
   * Called whenever a valid packet is received from the WebSocket.
   * @param {Object} packet The received packet
   */
  onPacket(packet) {
    this.emit('debug', `[WS] << ${JSON.stringify(packet)}`);
    switch (packet.op) {
      case VoiceOPCodes.HELLO:
        this.setHeartbeat(packet.d.heartbeat_interval);
        break;
      case VoiceOPCodes.READY:
        /**
         * Emitted once the voice WebSocket receives the ready packet.
         * @param {Object} packet The received packet
         * @event VoiceWebSocket#ready
         */
        this.emit('ready', packet.d);
        break;
      /* eslint-disable no-case-declarations */
      case VoiceOPCodes.SESSION_DESCRIPTION:
        packet.d.secret_key = new Uint8Array(packet.d.secret_key);
        /**
         * Emitted once the Voice Websocket receives a description of this voice session.
         * @param {Object} packet The received packet
         * @event VoiceWebSocket#sessionDescription
         */
        this.emit('sessionDescription', packet.d);
        break;
      case VoiceOPCodes.CLIENT_CONNECT:
        this.connection.ssrcMap.set(+packet.d.audio_ssrc, packet.d.user_id);
        break;
      case VoiceOPCodes.CLIENT_DISCONNECT:
        const streamInfo = this.connection.receiver && this.connection.receiver.packets.streams.get(packet.d.user_id);
        if (streamInfo) {
          this.connection.receiver.packets.streams.delete(packet.d.user_id);
          streamInfo.stream.push(null);
        }
        break;
      case VoiceOPCodes.SPEAKING:
        /**
         * Emitted whenever a speaking packet is received.
         * @param {Object} data
         * @event VoiceWebSocket#speaking
         */
        this.emit('speaking', packet.d);
        break;
      default:
        /**
         * Emitted when an unhandled packet is received.
         * @param {Object} packet
         * @event VoiceWebSocket#unknownPacket
         */
        this.emit('unknownPacket', packet);
        break;
    }
  }

  /**
   * Sets an interval at which to send a heartbeat packet to the WebSocket.
   * @param {number} interval The interval at which to send a heartbeat packet
   */
  setHeartbeat(interval) {
    if (!interval || isNaN(interval)) {
      this.onError(new Error('VOICE_INVALID_HEARTBEAT'));
      return;
    }
    if (this.heartbeatInterval) {
      /**
       * Emitted whenever the voice WebSocket encounters a non-fatal error.
       * @param {string} warn The warning
       * @event VoiceWebSocket#warn
       */
      this.emit('warn', 'A voice heartbeat interval is being overwritten');
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = this.client.setInterval(this.sendHeartbeat.bind(this), interval);
  }

  /**
   * Clears a heartbeat interval, if one exists.
   */
  clearHeartbeat() {
    if (!this.heartbeatInterval) {
      this.emit('warn', 'Tried to clear a heartbeat interval that does not exist');
      return;
    }
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
  }

  /**
   * Sends a heartbeat packet.
   */
  sendHeartbeat() {
    this.sendPacket({ op: VoiceOPCodes.HEARTBEAT, d: Math.floor(Math.random() * 10e10) }).catch(() => {
      this.emit('warn', 'Tried to send heartbeat, but connection is not open');
      this.clearHeartbeat();
    });
  }
}

module.exports = VoiceWebSocket;
