const EventEmitter = require('events').EventEmitter;
const NaCl = require('tweetnacl');

const nonce = new Buffer(24);
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
    this.player = player;
    this.stream = stream;
    this.startStreaming();
    this.streamOptions = streamOptions;
    this.streamOptions.volume = this.streamOptions.volume || 0;

    /**
     * Whether playing is paused
     * @type {boolean}
     */
    this.paused = false;

    this.destroyed = false;

    this.setVolume(streamOptions.volume || 1);
  }

  get passes() {
    return this.streamOptions.passes || 1;
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
    this.streamOptions.volume = volume;
  }

  /**
   * Set the volume in decibels
   * @param {number} db The decibels
   */
  setVolumeDecibels(db) {
    this.streamOptions.volume = Math.pow(10, db / 20);
  }

  /**
   * Set the volume so that a perceived value of 0.5 is half the perceived volume etc.
   * @param {number} value The value for the volume
   */
  setVolumeLogarithmic(value) {
    this.streamOptions.volume = Math.pow(value, 1.660964);
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
    this.speaking = value;
    /**
     * Emitted when the dispatcher starts/stops speaking
     * @event StreamDispatcher#speaking
     * @param {boolean} value Whether or not the dispatcher is speaking
     */
    this.emit('speaking', value);
  }

  sendBuffer(buffer, sequence, timestamp) {
    let repeats = this.passes;
    const packet = this.createPacket(sequence, timestamp, this.player.opusEncoder.encode(buffer));
    while (repeats--) {
      this.player.voiceConnection.sockets.udp.send(packet)
        .catch(e => this.emit('debug', `Failed to send a packet ${e}`));
    }
  }

  createPacket(sequence, timestamp, buffer) {
    const packetBuffer = new Buffer(buffer.length + 28);
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

    const out = new Buffer(buffer.length);
    for (let i = 0; i < buffer.length; i += 2) {
      if (i >= buffer.length - 1) break;
      const uint = Math.min(32767, Math.max(-32767, Math.floor(this.volume * buffer.readInt16LE(i))));
      out.writeInt16LE(uint, i);
    }

    return out;
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
        // data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;
        data.pausedTime += data.length * 10;
        this.player.voiceConnection.voiceManager.client.setTimeout(() => this.process(), data.length * 10);
        return;
      }

      this.setSpeaking(true);

      if (!data.startTime) {
        /**
         * Emitted once the dispatcher starts streaming
         * @event StreamDispatcher#start
         */
        this.emit('start');
        data.startTime = Date.now();
      }

      const bufferLength = 1920 * data.channels;
      let buffer = this.stream.read(bufferLength);
      if (!buffer) {
        data.missed++;
        data.pausedTime += data.length * 10;
        this.player.voiceConnection.voiceManager.client.setTimeout(() => this.process(), data.length * 10);
        return;
      }

      data.missed = 0;

      if (buffer.length !== bufferLength) {
        const newBuffer = new Buffer(bufferLength).fill(0);
        buffer.copy(newBuffer);
        buffer = newBuffer;
      }

      buffer = this.applyVolume(buffer);

      data.count++;
      data.sequence = (data.sequence + 1) < 65536 ? data.sequence + 1 : 0;
      data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;
      this.sendBuffer(buffer, data.sequence, data.timestamp);

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
  }

  startStreaming() {
    if (!this.stream) {
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
