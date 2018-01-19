const EventEmitter = require('events');
const prism = require('prism-media');
const PacketHandler = require('./PacketHandler');

class VoiceReceiver extends EventEmitter {
  constructor(connection) {
    super();
    this.connection = connection;
    this.packets = new PacketHandler(this);
    this.connection.sockets.udp.socket.on('message', buffer => this.packets.push(buffer));
  }

  createStream(user, pcm=false) {
    user = this.connection.client.users.resolve(user);
    if (!user) throw new Error('VOICE_USER_MISSING');
    console.log('making stream for', user.tag);
    const stream = this.packets.makeStream(user.id);
    if (pcm) {
      const decoder = new prism.opus.Decoder({ channels: 2, rate: 48000, frameSize: 1920 });
      stream.pipe(decoder);
      return decoder;
    }
    return stream;
  }

  stoppedSpeaking() {
    console.log('remember to remove this :)');
  }
}

module.exports = VoiceReceiver;
