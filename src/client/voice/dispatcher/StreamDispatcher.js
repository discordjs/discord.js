const VolumeInterface = require('../util/VolumeInterface');
const { Writable } = require('stream');

const secretbox = require('../util/Secretbox');

const FRAME_LENGTH = 20;
const CHANNELS = 2;
const TIMESTAMP_INC = (48000 / 100) * CHANNELS;

const nonce = Buffer.alloc(24);
nonce.fill(0);

/**
 * @external WritableStream
 * @see {@link https://nodejs.org/api/stream.html#stream_class_stream_writable}
 */

/**
 * The class that sends voice packet data to the voice connection.
 * ```js
 * // Obtained using:
 * voiceChannel.join().then(connection => {
 *   // You can play a file or a stream here:
 *   const dispatcher = connection.play('/home/hydrabolt/audio.mp3');
 * });
 * ```
 * @implements {VolumeInterface}
 * @extends {WritableStream}
 */
class StreamDispatcher extends Writable {
  constructor(
    player,
    { seek = 0, volume = 1, passes = 1, fec, plp, bitrate = 96, highWaterMark = 12 } = {},
    streams) {
    const streamOptions = { seek, volume, passes, fec, plp, bitrate, highWaterMark };
    super(streamOptions);
    /**
     * The Audio Player that controls this dispatcher
     * @type {AudioPlayer}
     */
    this.player = player;
    this.streamOptions = streamOptions;
    this.streams = streams;

    /**
     * The time that the stream was paused at (null if not paused)
     * @type {?number}
     */
    this.pausedSince = null;
    this._writeCallback = null;

    /**
     * The broadcast controlling this dispatcher, if any
     * @type {?VoiceBroadcast}
     */
    this.broadcast = this.streams.broadcast;

    this._pausedTime = 0;
    this.count = 0;

    this.on('finish', () => {
      // Still emitting end for backwards compatibility, probably remove it in the future!
      this.emit('end');
      this._setSpeaking(false);
    });

    if (typeof volume !== 'undefined') this.setVolume(volume);
    if (typeof fec !== 'undefined') this.setFEC(fec);
    if (typeof plp !== 'undefined') this.setPLP(plp);
    if (typeof bitrate !== 'undefined') this.setBitrate(bitrate);

    const streamError = (type, err) => {
      /**
       * Emitted when the dispatcher encounters an error.
       * @event StreamDispatcher#error
       */
      if (type && err) {
        err.message = `${type} stream: ${err.message}`;
        this.emit(this.player.dispatcher === this ? 'error' : 'debug', err);
      }
      this.destroy();
    };

    this.on('error', () => streamError());
    if (this.streams.input) this.streams.input.on('error', err => streamError('input', err));
    if (this.streams.ffmpeg) this.streams.ffmpeg.on('error', err => streamError('ffmpeg', err));
    if (this.streams.opus) this.streams.opus.on('error', err => streamError('opus', err));
    if (this.streams.volume) this.streams.volume.on('error', err => streamError('volume', err));
  }

  get _sdata() {
    return this.player.streamingData;
  }

  _write(chunk, enc, done) {
    if (!this.startTime) {
      /**
       * Emitted once the stream has started to play.
       * @event StreamDispatcher#start
       */
      this.emit('start');
      this.startTime = Date.now();
    }
    this._playChunk(chunk);
    this._step(done);
  }

  _destroy(err, cb) {
    if (this.player.dispatcher === this) this.player.dispatcher = null;
    const { streams } = this;
    if (streams.broadcast) streams.broadcast.dispatchers.delete(this);
    if (streams.opus) streams.opus.unpipe(this);
    if (streams.ffmpeg) streams.ffmpeg.destroy();
    super._destroy(err, cb);
  }

  /**
   * Pauses playback
   */
  pause() {
    this.pausedSince = Date.now();
  }

  /**
   * Whether or not playback is paused
   * @type {boolean}
   */
  get paused() { return Boolean(this.pausedSince); }

  /**
   * Total time that this dispatcher has been paused
   * @type {number}
   */
  get pausedTime() { return this._pausedTime + (this.paused ? Date.now() - this.pausedSince : 0); }

  /**
   * Resumes playback
   */
  resume() {
    if (!this.pausedSince) return;
    this._pausedTime += Date.now() - this.pausedSince;
    this.pausedSince = null;
    if (typeof this._writeCallback === 'function') this._writeCallback();
  }

  /**
   * The time (in milliseconds) that the dispatcher has actually been playing audio for
   * @type {number}
   */
  get streamTime() {
    return this.count * FRAME_LENGTH;
  }

  /**
   * The time (in milliseconds) that the dispatcher has been playing audio for, taking into account skips and pauses
   * @type {number}
   */
  get totalStreamTime() {
    return Date.now() - this.startTime;
  }

  /**
   * Set the bitrate of the current Opus encoder if using a compatible Opus stream.
   * @param {number} value New bitrate, in kbps
   * If set to 'auto', the voice channel's bitrate will be used
   * @returns {boolean} true if the bitrate has been successfully changed.
   */
  setBitrate(value) {
    if (!value || !this.bitrateEditable) return false;
    const bitrate = value === 'auto' ? this.player.voiceConnection.channel.bitrate : value;
    this.streams.opus.setBitrate(bitrate * 1000);
    return true;
  }

  /**
   * Sets the expected packet loss percentage if using a compatible Opus stream.
   * @param {number} value between 0 and 1
   * @returns {boolean} Returns true if it was successfully set.
   */
  setPLP(value) {
    if (!this.bitrateEditable) return false;
    this.streams.opus.setPLP(value);
    return true;
  }

  /**
   * Enables or disables forward error correction if using a compatible Opus stream.
   * @param {boolean} enabled true to enable
   * @returns {boolean} Returns true if it was successfully set.
   */
  setFEC(enabled) {
    if (!this.bitrateEditable) return false;
    this.streams.opus.setFEC(enabled);
    return true;
  }

  _step(done) {
    this._writeCallback = done;
    if (this.pausedSince) return;
    if (!this.streams.broadcast) {
      const next = FRAME_LENGTH + (this.count * FRAME_LENGTH) - (Date.now() - this.startTime - this.pausedTime);
      setTimeout(this._writeCallback.bind(this), next);
    }
    this._sdata.sequence++;
    this._sdata.timestamp += TIMESTAMP_INC;
    if (this._sdata.sequence >= 2 ** 16) this._sdata.sequence = 0;
    if (this._sdata.timestamp >= 2 ** 32) this._sdata.timestamp = 0;
    this.count++;
  }

  _playChunk(chunk) {
    if (this.player.dispatcher !== this || !this.player.voiceConnection.authentication.secretKey) return;
    this._setSpeaking(true);
    this._sendPacket(this._createPacket(this._sdata.sequence, this._sdata.timestamp, chunk));
  }

  _createPacket(sequence, timestamp, buffer) {
    const packetBuffer = Buffer.alloc(buffer.length + 28);
    packetBuffer.fill(0);
    packetBuffer[0] = 0x80;
    packetBuffer[1] = 0x78;

    packetBuffer.writeUIntBE(sequence, 2, 2);
    packetBuffer.writeUIntBE(timestamp, 4, 4);
    packetBuffer.writeUIntBE(this.player.voiceConnection.authentication.ssrc, 8, 4);

    packetBuffer.copy(nonce, 0, 0, 12);
    buffer = secretbox.methods.close(buffer, nonce, this.player.voiceConnection.authentication.secretKey);
    for (let i = 0; i < buffer.length; i++) packetBuffer[i + 12] = buffer[i];

    return packetBuffer;
  }

  _sendPacket(packet) {
    let repeats = this.streamOptions.passes;
    /**
     * Emitted whenever the dispatcher has debug information.
     * @event StreamDispatcher#debug
     * @param {string} info The debug info
     */
    this._setSpeaking(true);
    while (repeats--) {
      if (!this.player.voiceConnection.sockets.udp) {
        this.emit('debug', 'Failed to send a packet - no UDP socket');
        return;
      }
      this.player.voiceConnection.sockets.udp.send(packet)
        .catch(e => {
          this._setSpeaking(false);
          this.emit('debug', `Failed to send a packet - ${e}`);
        });
    }
  }

  _setSpeaking(value) {
    if (typeof this.player.voiceConnection !== 'undefined') {
      this.player.voiceConnection.setSpeaking(value);
    }
    /**
     * Emitted when the dispatcher starts/stops speaking.
     * @event StreamDispatcher#speaking
     * @param {boolean} value Whether or not the dispatcher is speaking
     */
    this.emit('speaking', value);
  }

  get volumeEditable() { return Boolean(this.streams.volume); }

  /**
   * Whether or not the Opus bitrate of this stream is editable
   * @type {boolean}
   */
  get bitrateEditable() { return this.streams.opus && this.streams.opus.setBitrate; }

  // Volume
  get volume() {
    return this.streams.volume ? this.streams.volume.volume : 1;
  }

  setVolume(value) {
    if (!this.streams.volume) return false;
    /**
     * Emitted when the volume of this dispatcher changes.
     * @event StreamDispatcher#volumeChange
     * @param {number} oldVolume The old volume of this dispatcher
     * @param {number} newVolume The new volume of this dispatcher
     */
    this.emit('volumeChange', this.volume, value);
    this.streams.volume.setVolume(value);
    return true;
  }

  // Volume stubs for docs
  /* eslint-disable no-empty-function*/
  get volumeDecibels() {}
  get volumeLogarithmic() {}
  setVolumeDecibels() {}
  setVolumeLogarithmic() {}
}

VolumeInterface.applyToClass(StreamDispatcher);

module.exports = StreamDispatcher;
