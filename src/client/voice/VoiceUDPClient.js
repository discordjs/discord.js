const udp = require('dgram');
const dns = require('dns');
const Constants = require('../../util/Constants');
const EventEmitter = require('events').EventEmitter;

function parseLocalPacket(message) {
  try {
    const packet = new Buffer(message);
    let address = '';
    for (let i = 4; i < packet.indexOf(0, i); i++) address += String.fromCharCode(packet[i]);
    const port = parseInt(packet.readUIntLE(packet.length - 2, 2).toString(10), 10);
    return { address, port };
  } catch (error) {
    return { error };
  }
}

/**
 * Represents a UDP Client for a Voice Connection
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
     * The address of the discord voice server
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
      try {
        this.socket.close();
      } catch (e) {
        return;
      }
      this.socket = null;
    }
  }

  /**
   * The port of the discord voice server
   * @type {number}
   * @readonly
   */
  get discordPort() {
    return this.voiceConnection.authentication.port;
  }

  /**
   * Tries to resolve the voice server endpoint to an address
   * @returns {Promise<string>}
   */
  findEndpointAddress() {
    return new Promise((resolve, reject) => {
      dns.lookup(this.voiceConnection.authentication.endpoint, (error, address) => {
        if (error) {
          reject(error);
          return;
        }
        this.discordAddress = address;
        resolve(address);
      });
    });
  }

  /**
   * Send a packet to the UDP client
   * @param {Object} packet the packet to send
   * @returns {Promise<Object>}
   */
  send(packet) {
    return new Promise((resolve, reject) => {
      if (!this.socket) throw new Error('Tried to send a UDP packet, but there is no socket available.');
      if (!this.discordAddress || !this.discordPort) throw new Error('Malformed UDP address or port.');
      this.socket.send(packet, 0, packet.length, this.discordPort, this.discordAddress, error => {
        if (error) reject(error); else resolve(packet);
      });
    });
  }

  createUDPSocket(address) {
    this.discordAddress = address;
    const socket = this.socket = udp.createSocket('udp4');

    socket.once('message', message => {
      const packet = parseLocalPacket(message);
      if (packet.error) {
        this.emit('error', packet.error);
        return;
      }

      this.localAddress = packet.address;
      this.localPort = packet.port;

      this.voiceConnection.sockets.ws.sendPacket({
        op: Constants.VoiceOPCodes.SELECT_PROTOCOL,
        d: {
          protocol: 'udp',
          data: {
            address: packet.address,
            port: packet.port,
            mode: 'xsalsa20_poly1305',
          },
        },
      });
    });

    const blankMessage = new Buffer(70);
    blankMessage.writeUIntBE(this.voiceConnection.authentication.ssrc, 0, 4);
    this.send(blankMessage);
  }
}

module.exports = VoiceConnectionUDPClient;
