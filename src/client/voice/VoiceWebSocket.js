const WebSocket = require('ws');
const Constants = require('../../util/Constants');
const SecretKey = require('./util/SecretKey');
const EventEmitter = require('events').EventEmitter;

/**
 * Represents a Voice Connection's WebSocket
 * @extends {EventEmitter}
 * @private
 */
class VoiceWebSocket extends EventEmitter {
  constructor(voiceConnection) {
    super();
    /**
     * The Voice Connection that this WebSocket serves
     * @type {VoiceConnection}
     */
    this.voiceConnection = voiceConnection;
  }

  /**
   * The client of this voice websocket
   * @type {Client}
   * @readonly
   */
  get client() {
    return this.voiceConnection.voiceManager.client;
  }

  /**
   * Starts connecting to the Voice WebSocket Server.
   */
  connect() {
    if (this.ws) {
      throw new Error('there is already an existing websocket');
    }
    /**
     * The actual WebSocket used to connect to the Voice WebSocket Server.
     * @type {WebSocket}
     */
    this.ws = new WebSocket(`wss://${this.voiceConnection.authentication.endpoint}`);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  /**
   * Sends data to the WebSocket if it is open.
   * @param {string} data the data to send to the WebSocket
   * @returns {Promise<string>}
   */
  send(data) {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(data, null, error => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      } else {
        reject(new Error('websocket not open'));
      }
    });
  }

  /**
   * JSON.stringify's a packet and then sends it to the WebSocket Server.
   * @param {Object} packet the packet to send
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
   * Called whenever the WebSocket opens
   */
  onOpen() {
    this.sendPacket({
      op: Constants.OPCodes.DISPATCH,
      d: {
        server_id: this.voiceConnection.channel.guild.id,
        user_id: this.client.user.id,
        token: this.voiceConnection.authentication.token,
        session_id: this.voiceConnection.authentication.session_id,
      },
    }).catch(() => {
      this.emit('error', new Error('tried to send join packet but WebSocket not open'));
    });
  }

  /**
   * Called whenever a message is received from the WebSocket
   * @param {MessageEvent} event the message event that was received
   * @returns {void}
   */
  onMessage(event) {
    try {
      return this.onPacket(JSON.stringify(event.data));
    } catch (error) {
      return this.onError(error);
    }
  }

  /**
   * Called whenever a valid packet is received from the WebSocket
   * @param {Object} packet the received packet
   */
  onPacket(packet) {
    switch (packet.op) {
      case Constants.VoiceOPCodes.READY:
        this.setHeartbeat(packet.d.heartbeat_interval);
        break;
      case Constants.VoiceOPCodes.SESSION_DESCRIPTION:
        this.emit('sessionDescription', packet.d.mode, new SecretKey(packet.d.secret_key));
        break;
      case Constants.VoiceOPCodes.SPEAKING:
        this.emit('speaking', packet.d);
        break;
    }
  }

  /**
   * Sets an interval at which to send a heartbeat packet to the WebSocket
   * @param {number} interval the interval at which to send a heartbeat packet
   */
  setHeartbeat(interval) {
    if (!interval || isNaN(interval)) {
      this.onError(new Error('tried to set voice heartbeat but no valid interval was specified'));
      return;
    }
    if (this.heartbeatInterval) {
      /**
       * Emitted whenver the voice websocket encounters a non-fatal error
       * @param {string} warn the warning
       * @event VoiceWebSocket#warn
       */
      this.emit('warn', 'a voice heartbeat interval is being overwritten');
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = this.client.setInterval(this.sendHeartbeat.bind(this), interval);
  }

  /**
   * Clears a heartbeat interval, if one exists
   */
  clearHeartbeat() {
    if (!this.heartbeatInterval) {
      this.emit('warn', 'tried to clear a heartbeat interval that does not exist');
      return;
    }
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
  }

  /**
   * Sends a heartbeat packet
   */
  sendHeartbeat() {
    this.sendPacket({ op: Constants.VoiceOPCodes.HEARTBEAT })
      .catch(() => {
        this.emit('warn', 'tried to send heartbeat, but connection is not open');
        this.clearHeartbeat();
      });
  }
}

module.exports = VoiceWebSocket;
