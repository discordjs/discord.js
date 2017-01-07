const EventEmitter = require('events').EventEmitter;
const NaCl = require('tweetnacl');
const VoiceBroadcast = require('../VoiceBroadcast');

const nonce = Buffer.alloc(24);
nonce.fill(0);

/**
 * The class that sends voice packet data to the voice connection.
 * ```js
 * // obtained using:
 * voiceChannel.join().then(connection => {
 *   // you can play a file or a stream here:
 *   const dispatcher = connection.playFile('./file.mp3');
 * });
 * ```
 * @extends {EventEmitter}
 */
class StreamDispatcher extends EventEmitter {
  constructor(player, stream, streamOptions) {
    super();
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
    this.streamOptions.volume = this.streamOptions.volume || 0;

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

    this.setVolume(streamOptions.volume || 1);
  }

  /**
   * How many passes the dispatcher should take when sending packets to reduce packet loss. Values over 5
   * aren't recommended, as it means you are using 5x more bandwidth. You _can_ edit this at runtime.
   * @type {number}
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
   * The volume of the stream, relative to the stream's input volume
   * @type {number}
   * @readonly
   */
  get volume() {
    return this.streamOptions.volume;
  }

  /**
   * Sets the volume relative to the input stream - i.e. 1 is normal, 0.5 is half, 2 is double.
   * @param {number} volume The volume that you want to set
   */
  setVolume(volume) {
    /**
     * Emitted when the volume of this dispatcher changes
     * @param {number} oldVolume the old volume
     * @param {number} newVolume the new volume
     * @event StreamDispatcher#volumeChange
     */
    this.emit('volumeChange', this.streamOptions.volume, volume);
    this.streamOptions.volume = volume;
  }

  /**
   * Set the volume in decibels
   * @param {number} db The decibels
   */
  setVolumeDecibels(db) {
    this.setVolume(Math.pow(10, db / 20));
  }

  /**
   * Set the volume so that a perceived value of 0.5 is half the perceived volume etc.
   * @param {number} value The value for the volume
   */
  setVolumeLogarithmic(value) {
    this.setVolume(Math.pow(value, 1.660964));
  }

  /**
   * Stops sending voice packets to the voice connection (stream may still progress however)
   */
  pause() { this.setPaused(true); }

  /**
   * Resumes sending voice packets to the voice connection (may be further on in the stream than when paused)
   */
  resume() { this.setPaused(false); }


  /**
   * Stops the current stream permanently and emits an `end` event.
   * @param {string} [reason='user'] An optional reason for stopping the dispatcher.
   */
  end(reason = 'user') {
    this.destroy('end', reason);
  }

  setSpeaking(value) {
    if (this.speaking === value) return;
    this.speaking = value;
    /**
     * Emitted when the dispatcher starts/stops speaking
     * @event StreamDispatcher#speaking
     * @param {boolean} value Whether or not the dispatcher is speaking
     */
    this.emit('speaking', value);
  }

  sendBuffer(buffer, sequence, timestamp, opusPacket) {
    opusPacket = opusPacket || this.player.opusEncoder.encode(buffer);
    const packet = this.createPacket(sequence, timestamp, opusPacket);
    this.sendPacket(packet);
  }

  sendPacket(packet) {
    let repeats = this.passes;
    /**
     * Emitted whenever the dispatcher has debug information
     * @event StreamDispatcher#debug
     * @param {string} info the debug info
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
    buffer = NaCl.secretbox(buffer, nonce, this.player.voiceConnection.authentication.secretKey.key);
    for (let i = 0; i < buffer.length; i++) packetBuffer[i + 12] = buffer[i];

    return packetBuffer;
  }

  applyVolume(buffer) {
    if (this.volume === 1) return buffer;

    const out = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i += 2) {
      if (i >= buffer.length - 1) break;
      const uint = Math.min(32767, Math.max(-32767, Math.floor(this.volume * buffer.readInt16LE(i))));
      out.writeInt16LE(uint, i);
    }

    return out;
  }

  process(buffer, controlled, packet) {
    try {
      if (this.destroyed) {
        this.setSpeaking(false);
        return;
      }

      const data = this.streamingData;

      if (data.missed >= 5 && !controlled) {
        this.destroy('end', 'Stream is not generating quickly enough.');
        return;
      }

      if (this.paused) {
        this.setSpeaking(false);
        // data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;
        data.pausedTime += data.length * 10;
        // if buffer is provided we are assuming a master process is controlling the dispatcher
        if (!buffer) this.player.voiceConnection.voiceManager.client.setTimeout(() => this.process(), data.length * 10);
        return;
      }

      if (!buffer && controlled) {
        data.missed++;
        data.pausedTime += data.length * 10;
        return;
      }

      if (!data.startTime) {
        /**
         * Emitted once the dispatcher starts streaming
         * @event StreamDispatcher#start
         */
        this.emit('start');
        data.startTime = Date.now();
      }

      if (packet) {
        data.count++;
        data.sequence = data.sequence < 65535 ? data.sequence + 1 : 0;
        data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;
        this.sendBuffer(null, data.sequence, data.timestamp, packet);
        return;
      }

      const bufferLength = 1920 * data.channels;
      if (!controlled) {
        buffer = this.stream.read(bufferLength);
        if (!buffer) {
          data.missed++;
          data.pausedTime += data.length * 10;
          this.player.voiceConnection.voiceManager.client.setTimeout(() => this.process(), data.length * 10);
          return;
        }
      }

      data.missed = 0;

      if (buffer.length !== bufferLength) {
        const newBuffer = Buffer.alloc(bufferLength).fill(0);
        buffer.copy(newBuffer);
        buffer = newBuffer;
      }

      buffer = this.applyVolume(buffer);

      data.count++;
      data.sequence = data.sequence < 65535 ? data.sequence + 1 : 0;
      data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;
      this.sendBuffer(buffer, data.sequence, data.timestamp);

      if (controlled) return;
      const nextTime = data.length + (data.startTime + data.pausedTime + (data.count * data.length) - Date.now());
      this.player.voiceConnection.voiceManager.client.setTimeout(() => this.process(), nextTime);
    } catch (e) {
      this.destroy('error', e);
    }
  }

  destroy(type, reason) {
    if (this.destroyed) return;
    this.destroyed = true;
    this.setSpeaking(false);
    this.emit(type, reason);
    /**
     * Emitted once the dispatcher ends
     * @param {string} [reason] the reason the dispatcher ended
     * @event StreamDispatcher#end
     */
    if (type !== 'end') this.emit('end', `destroyed due to ${type} - ${reason}`);
  }

  startStreaming() {
    if (!this.stream) {
      /**
       * Emitted if the dispatcher encounters an error
       * @event StreamDispatcher#error
       * @param {string} error the error message
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
