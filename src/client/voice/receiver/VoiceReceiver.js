const EventEmitter = require('events').EventEmitter;
const NaCl = require('tweetnacl');

const nonce = new Buffer(24);
nonce.fill(0);

/**
 * Receives voice data from a voice connection.
 * @extends {EventEmitter}
 */
class VoiceReceiver extends EventEmitter {
  constructor(connection) {
    super();
    /*
      need a queue because we don't get the ssrc of the user speaking until after the first few packets,
      so we queue up unknown SSRCs until they become known, then empty the queue.
    */
    this.queues = new Map();
    /**
     * The VoiceConnection that instantiated this
     * @type {VoiceConnection}
     */
    this.connection = connection;
    this.connection.udp.udpSocket.on('message', msg => {
      const ssrc = +msg.readUInt32BE(8).toString(10);
      const user = this.connection.ssrcMap.get(ssrc);
      if (!user) {
        if (!this.queues.has(ssrc)) {
          this.queues.set(ssrc, []);
        }
        this.queues.get(ssrc).push(msg);
      }
      if (user) {
        if (this.queues.get(ssrc)) {
          this.queues.get(ssrc).push(msg);
          this.queues.get(ssrc).map(m => this.handlePacket(m, user));
          this.queues.delete(ssrc);
        }
      }
    });
  }

  handlePacket(msg, user) {
    msg.copy(nonce, 0, 0, 12);
    let data = NaCl.secretbox.open(msg.slice(12), nonce, this.connection.data.secret);
    if (!data) {
      /**
       * Emitted whenever a voice packet cannot be decrypted
       * @event VoiceReceiver#warn
       * @param {String} message the warning message
       */
      return this.emit('warn', 'failed to decrypt voice packet');
    }
    data = new Buffer(data);
      /**
       * Emitted whenever voice data is received from the voice connection. This is _always_ emitted (unlike PCM).
       * @event VoiceReceiver#opus
       * @param {User} user the user that is sending the buffer (is speaking)
       * @param {Buffer} buffer the opus buffer
       */
    this.emit('opus', user, data);
    if (this.listenerCount('pcm') > 0) {
        /**
         * Emits decoded voice data when it's received. For performance reasons, the decoding will only
         * happen if there is at least one `pcm` listener on this receiver.
         * @event VoiceReceiver#pcm
         * @param {User} user the user that is sending the buffer (is speaking)
         * @param {Buffer} buffer the decoded buffer
         */
      this.emit('pcm', user, this.connection.player.opusEncoder.decode(data));
    }
  }
}

module.exports = VoiceReceiver;
