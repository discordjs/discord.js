const udp = require('dgram');
const dns = require('dns');
const Constants = require('../../util/Constants');
const EventEmitter = require('events').EventEmitter;

class VoiceConnectionUDPClient extends EventEmitter {
  constructor(voiceConnection, data) {
    super();
    this.voiceConnection = voiceConnection;
    this.count = 0;
    this.data = data;
    this.dnsLookup();
  }

  dnsLookup() {
    dns.lookup(this.voiceConnection.endpoint, (err, address) => {
      if (err) {
        this.emit('error', err);
        return;
      }
      this.connectUDP(address);
    });
  }

  send(packet) {
    if (this.udpSocket) {
      try {
        this.udpSocket.send(packet, 0, packet.length, this.data.port, this.udpIP);
      } catch (err) {
        this.emit('error', err);
      }
    }
  }

  _shutdown() {
    if (this.udpSocket) {
      try {
        this.udpSocket.close();
      } catch (err) {
        if (err.message !== 'Not running') this.emit('error', err);
      }
      this.udpSocket = null;
    }
  }

  connectUDP(address) {
    this.udpIP = address;
    this.udpSocket = udp.createSocket('udp4');

    // finding local IP
    // https://discordapp.com/developers/docs/topics/voice-connections#ip-discovery
    this.udpSocket.once('message', message => {
      const packet = new Buffer(message);
      this.localIP = '';
      for (let i = 4; i < packet.indexOf(0, i); i++) this.localIP += String.fromCharCode(packet[i]);
      this.localPort = parseInt(packet.readUIntLE(packet.length - 2, 2).toString(10), 10);

      this.voiceConnection.websocket.send({
        op: Constants.VoiceOPCodes.SELECT_PROTOCOL,
        d: {
          protocol: 'udp',
          data: {
            address: this.localIP,
            port: this.localPort,
            mode: 'xsalsa20_poly1305',
          },
        },
      });
    });

    this.udpSocket.on('error', (error, message) => {
      this.emit('error', { error, message });
    });
    this.udpSocket.on('close', error => {
      this.emit('close', error);
    });

    const blankMessage = new Buffer(70);
    blankMessage.writeUIntBE(this.data.ssrc, 0, 4);
    this.send(blankMessage);
  }
}

module.exports = VoiceConnectionUDPClient;
