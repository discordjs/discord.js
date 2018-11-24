const udp = require('dgram');
const { VoiceOPCodes } = require('../../../util/Constants');
const EventEmitter = require('events');
const { Error } = require('../../../errors');

/**
 * Represents a UDP client for a Voice Connection.
 * @extends {EventEmitter}
 * @private
 */
class VoiceConnectionUDPClient extends EventEmitter {
  constructor(voiceConnection) {
    super();

    /**
     * The voice connection that this UDP client serves
     * @type {VoiceConnection}
     */
    this.voiceConnection = voiceConnection;

    /**
     * The UDP socket
     * @type {?Socket}
     */
    this.socket = null;

    /**
     * The address of the Discord voice server
     * @type {?string}
     */
    this.discordAddress = null;

    /**
     * The local IP address
     * @type {?string}
     */
    this.localAddress = null;

    /**
     * The local port
     * @type {?string}
     */
    this.localPort = null;

    this.voiceConnection.on('closing', this.shutdown.bind(this));
  }

  shutdown() {
    if (this.socket) {
      this.socket.removeAllListeners('message');
      try {
        this.socket.close();
      } finally {
        this.socket = null;
      }
    }
  }

  /**
   * The port of the Discord voice server
   * @type {number}
   * @readonly
   */
  get discordPort() {
    return this.voiceConnection.authentication.port;
  }

  /**
   * Send a packet to the UDP client.
   * @param {Object} packet The packet to send
   * @returns {Promise<Object>}
   */
  send(packet) {
    return new Promise((resolve, reject) => {
      if (!this.socket) throw new Error('UDP_SEND_FAIL');
      if (!this.discordAddress || !this.discordPort) throw new Error('UDP_ADDRESS_MALFORMED');
      this.socket.send(packet, 0, packet.length, this.discordPort, this.discordAddress, error => {
        if (error) reject(error); else resolve(packet);
      });
    });
  }

  createUDPSocket(address) {
    this.discordAddress = address;
    const socket = this.socket = udp.createSocket('udp4');

    socket.once('message', message => {
      // Stop if the sockets have been deleted because the connection has been closed already
      if (!this.voiceConnection.sockets.ws) return;

      const packet = parseLocalPacket(message);
      if (packet.error) {
        this.emit('error', packet.error);
        return;
      }

      this.localAddress = packet.address;
      this.localPort = packet.port;

      this.voiceConnection.sockets.ws.sendPacket({
        op: VoiceOPCodes.SELECT_PROTOCOL,
        d: {
          protocol: 'udp',
          data: {
            address: packet.address,
            port: packet.port,
            mode: this.voiceConnection.authentication.mode,
          },
        },
      });

      socket.on('message', buffer => this.voiceConnection.receiver.packets.push(buffer));
    });

    const blankMessage = Buffer.alloc(70);
    blankMessage.writeUIntBE(this.voiceConnection.authentication.ssrc, 0, 4);
    this.send(blankMessage);
  }
}

function parseLocalPacket(message) {
  try {
    const packet = Buffer.from(message);
    let address = '';
    for (let i = 4; i < packet.indexOf(0, i); i++) address += String.fromCharCode(packet[i]);
    const port = parseInt(packet.readUIntLE(packet.length - 2, 2).toString(10), 10);
    return { address, port };
  } catch (error) {
    return { error };
  }
}

module.exports = VoiceConnectionUDPClient;
