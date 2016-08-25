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
    /**
     * The VoiceConnection that instantiated this
     * @type {VoiceConnection}
     */
    this.connection = connection;
    this.connection.udp.udpSocket.on('message', msg => {
      msg.copy(nonce, 0, 0, 12);
      let data = NaCl.secretbox.open(msg.slice(12), nonce, this.connection.data.secret);
      if (!data) {
        return this.emit('warn', 'failed to decrypt voice packet');
      }
      data = new Buffer(data);
      /**
       * Emitted whenever voice data is received from the voice connection. This is _always_ emitted (unlike PCM).
       * @event VoiceReceiver#opus
       * @param {Buffer} buffer the opus buffer
       */
      this.emit('opus', data);
      if (this.listenerCount('pcm') > 0) {
        /**
         * Emits decoded voice data when it's received. For performance reasons, the decoding will only
         * happen if there is at least one `pcm` listener on this receiver.
         * @event VoiceReceiver#pcm
         * @param {Buffer} buffer the decoded buffer
         */
        this.emit('pcm', this.connection.player.opusEncoder.decode(data));
      }
    });
  }
}

module.exports = VoiceReceiver;
