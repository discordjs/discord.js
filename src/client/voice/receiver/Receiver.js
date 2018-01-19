const EventEmitter = require('events');
const prism = require('prism-media');
const PacketHandler = require('./PacketHandler');

class VoiceReceiver extends EventEmitter {
  constructor(connection) {
    super();
    this.connection = connection;
    this.packets = new PacketHandler(this);
    /**
     * Emitted whenever there is a warning
     * @event VoiceReceiver#debug
     * @param {Error|string} error The error or message to debug
     */
    this.packets.on('error', err => this.emit('debug', err));
    this.connection.sockets.udp.socket.on('message', buffer => this.packets.push(buffer));
  }

  createStream(user, { mode = 'opus' } = {}) {
    user = this.connection.client.users.resolve(user);
    if (!user) throw new Error('VOICE_USER_MISSING');
    const stream = this.packets.makeStream(user.id);
    if (mode === 'pcm') {
      const decoder = new prism.opus.Decoder({ channels: 2, rate: 48000, frameSize: 1920 });
      stream.pipe(decoder);
      return decoder;
    }
    return stream;
  }
}

module.exports = VoiceReceiver;
