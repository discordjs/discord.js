const EventEmitter = require('events').EventEmitter;
const NaCl = require('tweetnacl');
const Readable = require('./VoiceReadable');

const nonce = new Buffer(24);
nonce.fill(0);

/**
 * Receives voice data from a voice connection.
 * ```js
 * // obtained using:
 * voiceChannel.join().then(connection => {
 *  const receiver = connection.createReceiver();
 * });
 * ```
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
    this.pcmStreams = new Map();
    this.opusStreams = new Map();

    /**
     * Whether or not this receiver has been destroyed.
     * @type {boolean}
     */
    this.destroyed = false;

    /**
     * The VoiceConnection that instantiated this
     * @type {VoiceConnection}
     */
    this.voiceConnection = connection;

    this._listener = msg => {
      const ssrc = +msg.readUInt32BE(8).toString(10);
      const user = this.voiceConnection.ssrcMap.get(ssrc);
      if (!user) {
        if (!this.queues.has(ssrc)) this.queues.set(ssrc, []);
        this.queues.get(ssrc).push(msg);
      } else {
        if (this.queues.get(ssrc)) {
          this.queues.get(ssrc).push(msg);
          this.queues.get(ssrc).map(m => this.handlePacket(m, user));
          this.queues.delete(ssrc);
          return;
        }
        this.handlePacket(msg, user);
      }
    };
    this.voiceConnection.sockets.udp.socket.on('message', this._listener);
  }

  /**
   * If this VoiceReceiver has been destroyed, running `recreate()` will recreate the listener.
   * This avoids you having to create a new receiver.
   * <info>Any streams that you had prior to destroying the receiver will not be recreated.</info>
   */
  recreate() {
    if (!this.destroyed) return;
    this.voiceConnection.sockets.udp.socket.on('message', this._listener);
    this.destroyed = false;
    return;
  }

  /**
   * Destroy this VoiceReceiver, also ending any streams that it may be controlling.
   */
  destroy() {
    this.voiceConnection.sockets.udp.socket.removeListener('message', this._listener);
    for (const stream of this.pcmStreams) {
      stream[1]._push(null);
      this.pcmStreams.delete(stream[0]);
    }
    for (const stream of this.opusStreams) {
      stream[1]._push(null);
      this.opusStreams.delete(stream[0]);
    }
    this.destroyed = true;
  }

  /**
   * Creates a readable stream for a user that provides opus data while the user is speaking. When the user
   * stops speaking, the stream is destroyed.
   * @param {UserResolvable} user The user to create the stream for
   * @returns {ReadableStream}
   */
  createOpusStream(user) {
    user = this.voiceConnection.voiceManager.client.resolver.resolveUser(user);
    if (!user) throw new Error('Couldn\'t resolve the user to create Opus stream.');
    if (this.opusStreams.get(user.id)) throw new Error('There is already an existing stream for that user.');
    const stream = new Readable();
    this.opusStreams.set(user.id, stream);
    return stream;
  }

  /**
   * Creates a readable stream for a user that provides PCM data while the user is speaking. When the user
   * stops speaking, the stream is destroyed. The stream is 32-bit signed stereo PCM at 48KHz.
   * @param {UserResolvable} user The user to create the stream for
   * @returns {ReadableStream}
   */
  createPCMStream(user) {
    user = this.voiceConnection.voiceManager.client.resolver.resolveUser(user);
    if (!user) throw new Error('Couldn\'t resolve the user to create PCM stream.');
    if (this.pcmStreams.get(user.id)) throw new Error('There is already an existing stream for that user.');
    const stream = new Readable();
    this.pcmStreams.set(user.id, stream);
    return stream;
  }

  handlePacket(msg, user) {
    msg.copy(nonce, 0, 0, 12);
    let data = NaCl.secretbox.open(msg.slice(12), nonce, this.voiceConnection.authentication.secretKey.key);
    if (!data) {
      /**
       * Emitted whenever a voice packet cannot be decrypted
       * @event VoiceReceiver#warn
       * @param {string} message The warning message
       */
      this.emit('warn', 'Failed to decrypt voice packet');
      return;
    }
    data = new Buffer(data);
    if (this.opusStreams.get(user.id)) this.opusStreams.get(user.id)._push(data);
    /**
     * Emitted whenever voice data is received from the voice connection. This is _always_ emitted (unlike PCM).
     * @event VoiceReceiver#opus
     * @param {User} user The user that is sending the buffer (is speaking)
     * @param {Buffer} buffer The opus buffer
     */
    this.emit('opus', user, data);
    if (this.listenerCount('pcm') > 0 || this.pcmStreams.size > 0) {
      /**
       * Emits decoded voice data when it's received. For performance reasons, the decoding will only
       * happen if there is at least one `pcm` listener on this receiver.
       * @event VoiceReceiver#pcm
       * @param {User} user The user that is sending the buffer (is speaking)
       * @param {Buffer} buffer The decoded buffer
       */
      const pcm = this.voiceConnection.player.opusEncoder.decode(data);
      if (this.pcmStreams.get(user.id)) this.pcmStreams.get(user.id)._push(pcm);
      this.emit('pcm', user, pcm);
    }
  }
}

module.exports = VoiceReceiver;
