const EventEmitter = require('events');

class VoiceReceiver extends EventEmitter {
  constructor(connection) {
    super();
    this.connection = connection;
    this.packets = new PacketHandler(this); 
    this.connection.sockets.udp.socket.on('message', buffer => this.packets.push(buffer));
  }

  createStream(user, pcm=false) {

  }
}

module.exports = VoiceReceiver;
