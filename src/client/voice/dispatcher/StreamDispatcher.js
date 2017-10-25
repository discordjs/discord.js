const VolumeInterface = require('../util/VolumeInterface');
const VoiceBroadcast = require('../VoiceBroadcast');
const { VoiceStatus } = require('../../../util/Constants');
const { Writable } = require('stream');

const secretbox = require('../util/Secretbox');

const FRAME_LENGTH = 20;

const nonce = Buffer.alloc(24);
nonce.fill(0);

/**
 * The class that sends voice packet data to the voice connection.
 * ```js
 * // Obtained using:
 * voiceChannel.join().then(connection => {
 *   // You can play a file or a stream here:
 *   const dispatcher = connection.playFile('./file.mp3');
 * });
 * ```
 * @implements {VolumeInterface}
 */
class StreamDispatcher extends Writable {
  constructor(player, streamOptions) {
    super(streamOptions);
    /**
     * The Audio Player that controls this dispatcher
     * @type {AudioPlayer}
     */
    this.player = player;
    this.streamOptions = streamOptions;
    this.startTime = null;
    this.on('error', this.destroy.bind(this));
    this.on('finish', () => {
      this.destroy.bind(this);
      this.emit('end');
    });
  }

  get _sdata() {
    return this.player.streamingData;
  }

  _write(chunk, enc, done) {
    if (!this.startTime) this.startTime = Date.now();
    this.setSpeaking(true);
    const packet = this.createPacket(this._sdata.sequence, this._sdata.timestamp, chunk);
    this.sendPacket(packet);
    const next = FRAME_LENGTH + (this.startTime + (this._sdata.count * FRAME_LENGTH) - Date.now());
    setTimeout(done.bind(this), next);
    // Do overflow checks here!
    this._sdata.sequence++;
    this._sdata.timestamp += 960;
    this._sdata.count++;
  }

  createPacket(sequence, timestamp, buffer) {
    const packetBuffer = Buffer.alloc(buffer.length + 28);
    packetBuffer.fill(0);
    packetBuffer[0] = 0x80;
    packetBuffer[1] = 0x78;

    packetBuffer.writeUIntBE(sequence, 2, 2);
    packetBuffer.writeUIntBE(timestamp, 4, 4);
    packetBuffer.writeUIntBE(this.player.voiceConnection.authentication.ssrc, 8, 4);

    packetBuffer.copy(nonce, 0, 0, 12);
    buffer = secretbox.methods.close(buffer, nonce, this.player.voiceConnection.authentication.secretKey.key);
    for (let i = 0; i < buffer.length; i++) packetBuffer[i + 12] = buffer[i];

    return packetBuffer;
  }

  sendPacket(packet) {
    let repeats = 1;
    /**
     * Emitted whenever the dispatcher has debug information.
     * @event StreamDispatcher#debug
     * @param {string} info The debug info
     */
    this.setSpeaking(true);
    while (repeats--) {
      this.player.voiceConnection.sockets.udp.send(packet)
        .catch(e => {
          this.setSpeaking(false);
          this.emit('debug', `Failed to send a packet ${e}`);
        });
    }
  }

  setSpeaking(value) {
    if (this.speaking === value) return;
    if (this.player.voiceConnection.status !== VoiceStatus.CONNECTED) return;
    this.speaking = value;
    /**
     * Emitted when the dispatcher starts/stops speaking.
     * @event StreamDispatcher#speaking
     * @param {boolean} value Whether or not the dispatcher is speaking
     */
    this.emit('speaking', value);
  }

  destroy() {
    if (this.player.dispatcher !== this) return;
    this.player.dispatcher = null;
    const streams = this.player.streams;
    this.end();
    if (streams.opus) streams.opus.unpipe(this);
    if (streams.ffmpeg) streams.ffmpeg.destroy();
  }
}

module.exports = StreamDispatcher;
