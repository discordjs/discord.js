const VolumeInterface = require('../util/VolumeInterface');
const VoiceBroadcast = require('../VoiceBroadcast');
const { VoiceStatus } = require('../../../util/Constants');

const secretbox = require('../util/Secretbox');

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
class StreamDispatcher extends VolumeInterface {
  constructor(player, stream, streamOptions) {
    super(streamOptions);
    /**
     * The Audio Player that controls this dispatcher
     * @type {AudioPlayer}
     */
    this.player = player;
    /**
     * The stream that the dispatcher plays
     * @type {ReadableStream|VoiceBroadcast}
     */
    this.stream = stream;
    if (!(this.stream instanceof VoiceBroadcast)) this.startStreaming();
    this.streamOptions = streamOptions;

    const data = this.streamingData;
    data.length = 20;
    data.missed = 0;

    /**
     * Whether playing is paused
     * @type {boolean}
     */
    this.paused = false;
    /**
     * Whether this dispatcher has been destroyed
     * @type {boolean}
     */
    this.destroyed = false;

    this._opus = streamOptions.opus;
  }

  /**
   * How many passes the dispatcher should take when sending packets to reduce packet loss. Values over 5
   * aren't recommended, as it means you are using 5x more bandwidth. You _can_ edit this at runtime
   * @type {number}
   * @readonly
   */
  get passes() {
    return this.streamOptions.passes || 1;
  }

  set passes(n) {
    this.streamOptions.passes = n;
  }

  get streamingData() {
    return this.player.streamingData;
  }

  /**
   * How long the stream dispatcher has been "speaking" for
   * @type {number}
   * @readonly
   */
  get time() {
    return this.streamingData.count * (this.streamingData.length || 0);
  }

  /**
   * The total time, taking into account pauses and skips, that the dispatcher has been streaming for
   * @type {number}
   * @readonly
   */
  get totalStreamTime() {
    return this.time + this.streamingData.pausedTime;
  }

  /**
   * Stops sending voice packets to the voice connection (stream may still progress however).
   */
  pause() { this.setPaused(true); }

  /**
   * Resumes sending voice packets to the voice connection (may be further on in the stream than when paused).
   */
  resume() { this.setPaused(false); }


  /**
   * Stops the current stream permanently and emits an `end` event.
   * @param {string} [reason='user'] An optional reason for stopping the dispatcher
   */
  end(reason = 'user') {
    this.destroy('end', reason);
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


  /**
   * Sets the bitrate of the current Opus encoder.
   * @param {number} bitrate New bitrate, in kbps.
   * If set to 'auto', the voice channel's bitrate will be used
   */
  setBitrate(bitrate) {
    this.player.setBitrate(bitrate);
  }

  sendBuffer(buffer, sequence, timestamp, opusPacket) {
    opusPacket = opusPacket || this.player.opusEncoder.encode(buffer);
    const packet = this.createPacket(sequence, timestamp, opusPacket);
    this.sendPacket(packet);
  }

  sendPacket(packet) {
    let repeats = this.passes;
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

  processPacket(packet) {
    try {
      if (this.destroyed) {
        this.setSpeaking(false);
        return;
      }

      const data = this.streamingData;

      if (this.paused) {
        this.setSpeaking(false);
        data.pausedTime = data.length * 10;
        return;
      }

      if (!packet) {
        data.missed++;
        data.pausedTime += data.length * 10;
        return;
      }

      this.started();
      this.missed = 0;

      this.stepStreamingData();
      this.sendBuffer(null, data.sequence, data.timestamp, packet);
    } catch (e) {
      this.destroy('error', e);
    }
  }

  process() {
    try {
      if (this.destroyed) {
        this.setSpeaking(false);
        return;
      }

      const data = this.streamingData;

      if (data.missed >= 5) {
        this.destroy('end', 'Stream is not generating quickly enough.');
        return;
      }

      if (this.paused) {
        this.setSpeaking(false);
        // Old code?
        // data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;
        data.pausedTime += data.length * 10;
        this.player.voiceConnection.voiceManager.client.setTimeout(() => this.process(), data.length * 10);
        return;
      }

      this.started();

      const buffer = this.readStreamBuffer();
      if (!buffer) {
        data.missed++;
        data.pausedTime += data.length * 10;
        this.player.voiceConnection.voiceManager.client.setTimeout(() => this.process(), data.length * 10);
        return;
      }

      data.missed = 0;

      this.stepStreamingData();

      if (this._opus) {
        this.sendBuffer(null, data.sequence, data.timestamp, buffer);
      } else {
        this.sendBuffer(buffer, data.sequence, data.timestamp);
      }

      const nextTime = data.length + (data.startTime + data.pausedTime + (data.count * data.length) - Date.now());
      this.player.voiceConnection.voiceManager.client.setTimeout(() => this.process(), nextTime);
    } catch (e) {
      this.destroy('error', e);
    }
  }

  readStreamBuffer() {
    const data = this.streamingData;
    const bufferLength = (this._opus ? 80 : 1920) * data.channels;
    let buffer = this.stream.read(bufferLength);
    if (this._opus) return buffer;
    if (!buffer) return null;

    if (buffer.length !== bufferLength) {
      const newBuffer = Buffer.alloc(bufferLength).fill(0);
      buffer.copy(newBuffer);
      buffer = newBuffer;
    }

    buffer = this.applyVolume(buffer);
    return buffer;
  }

  started() {
    const data = this.streamingData;

    if (!data.startTime) {
      /**
       * Emitted once the dispatcher starts streaming.
       * @event StreamDispatcher#start
       */
      this.emit('start');
      data.startTime = Date.now();
    }
  }

  stepStreamingData() {
    const data = this.streamingData;
    data.count++;
    data.sequence = data.sequence < 65535 ? data.sequence + 1 : 0;
    data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;
  }

  destroy(type, reason) {
    if (this.destroyed) return;
    this.destroyed = true;
    this.setSpeaking(false);
    this.emit(type, reason);
    /**
     * Emitted once the dispatcher ends.
     * @param {string} [reason] The reason the dispatcher ended
     * @event StreamDispatcher#end
     */
    if (type !== 'end') this.emit('end', `destroyed due to ${type} - ${reason}`);
  }

  startStreaming() {
    if (!this.stream) {
      /**
       * Emitted if the dispatcher encounters an error.
       * @event StreamDispatcher#error
       * @param {string} error The error message
       */
      this.emit('error', 'No stream');
      return;
    }

    this.stream.on('end', err => this.destroy('end', err || 'stream'));
    this.stream.on('error', err => this.destroy('error', err));

    const data = this.streamingData;
    data.length = 20;
    data.missed = 0;

    this.stream.once('readable', () => {
      data.startTime = null;
      data.count = 0;
      this.process();
    });
  }

  setPaused(paused) { this.setSpeaking(!(this.paused = paused)); }
}

module.exports = StreamDispatcher;
