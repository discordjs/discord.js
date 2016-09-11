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
 *   connection.playFile('./file.mp3').then(dispatcher => {
 *
 *   });
 * });
 * ```
 * @extends {EventEmitter}
 */
class StreamDispatcher extends EventEmitter {
  constructor(player, stream, sd, streamOptions) {
    super();
    this.player = player;
    this.stream = stream;
    this.streamingData = {
      channels: 2,
      count: 0,
      sequence: sd.sequence,
      timestamp: sd.timestamp,
      pausedTime: 0,
    };
    this._startStreaming();
    this._triggered = false;
    this._volume = streamOptions.volume;
    /**
     * How many passes the dispatcher should take when sending packets to reduce packet loss. Values over 5
     * aren't recommended, as it means you are using 5x more bandwidth. You _can_ edit this at runtime.
     * @type {number}
     */
    this.passes = streamOptions.passes || 1;
  }

  /**
   * Emitted when the dispatcher starts/stops speaking
   * @event StreamDispatcher#speaking
   * @param {boolean} value Whether or not the dispatcher is speaking
   */
  _setSpeaking(value) {
    this.speaking = value;
    this.emit('speaking', value);
  }

  _sendBuffer(buffer, sequence, timestamp) {
    let repeats = this.passes;
    const packet = this._createPacket(sequence, timestamp, this.player.opusEncoder.encode(buffer));
    while (repeats--) {
      this.player.connection.udp.send(packet);
    }
  }

  /**
   * how long the stream dispatcher has been "speaking" for
   * @type {number}
   * @readonly
   */
  get time() {
    return this.streamingData.count * (this.streamingData.length || 0);
  }

  /**
   * The total time, taking into account pauses and skips, that the dispatcher has been streaming for.
   * @type {number}
   * @readonly
   */
  get totalStreamTime() {
    return this.time + this.streamingData.pausedTime;
  }

  _createPacket(sequence, timestamp, buffer) {
    const packetBuffer = new Buffer(buffer.length + 28);
    packetBuffer.fill(0);
    packetBuffer[0] = 0x80;
    packetBuffer[1] = 0x78;

    packetBuffer.writeUIntBE(sequence, 2, 2);
    packetBuffer.writeUIntBE(timestamp, 4, 4);
    packetBuffer.writeUIntBE(this.player.connection.data.ssrc, 8, 4);

    packetBuffer.copy(nonce, 0, 0, 12);
    buffer = NaCl.secretbox(buffer, nonce, this.player.connection.data.secret);

    for (let i = 0; i < buffer.length; i++) packetBuffer[i + 12] = buffer[i];

    return packetBuffer;
  }

  _applyVolume(buffer) {
    if (this._volume === 1) return buffer;

    const out = new Buffer(buffer.length);
    for (let i = 0; i < buffer.length; i += 2) {
      if (i >= buffer.length - 1) break;
      const uint = Math.min(32767, Math.max(-32767, Math.floor(this._volume * buffer.readInt16LE(i))));
      out.writeInt16LE(uint, i);
    }

    return out;
  }

  _send() {
    try {
      if (this._triggered) {
        this._setSpeaking(false);
        return;
      }

      const data = this.streamingData;

      if (data.missed >= 5) {
        this._triggerTerminalState('end', 'Stream is not generating quickly enough.');
        return;
      }

      if (this.paused) {
        // data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;
        data.pausedTime += data.length * 10;
        this.player.connection.manager.client.setTimeout(() => this._send(), data.length * 10);
        return;
      }

      this._setSpeaking(true);

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
        this.player.connection.manager.client.setTimeout(() => this._send(), data.length * 10);
        return;
      }

      data.missed = 0;

      if (buffer.length !== bufferLength) {
        const newBuffer = new Buffer(bufferLength).fill(0);
        buffer.copy(newBuffer);
        buffer = newBuffer;
      }

      buffer = this._applyVolume(buffer);

      data.count++;
      data.sequence = (data.sequence + 1) < (65536) ? data.sequence + 1 : 0;
      data.timestamp = data.timestamp + 4294967295 ? data.timestamp + 960 : 0;

      this._sendBuffer(buffer, data.sequence, data.timestamp);

      const nextTime = data.length + (data.startTime + data.pausedTime + (data.count * data.length) - Date.now());
      this.player.connection.manager.client.setTimeout(() => this._send(), nextTime);
    } catch (e) {
      this._triggerTerminalState('error', e);
    }
  }

  /**
   * Emitted once the stream has ended. Attach a `once` listener to this.
   * @event StreamDispatcher#end
   */
  _triggerEnd() {
    this.emit('end');
  }

  /**
   * Emitted once the stream has encountered an error. Attach a `once` listener to this. Also emits `end`.
   * @event StreamDispatcher#error
   * @param {Error} err The encountered error
   */
  _triggerError(err) {
    this.emit('end');
    this.emit('error', err);
  }

  _triggerTerminalState(state, err) {
    if (this._triggered) return;

    /**
     * Emitted when the stream wants to give debug information.
     * @event StreamDispatcher#debug
     * @param {string} information The debug information
     */
    this.emit('debug', `Triggered terminal state ${state} - stream is now dead`);
    this._triggered = true;
    this._setSpeaking(false);
    switch (state) {
      case 'end':
        this._triggerEnd(err);
        break;
      case 'error':
        this._triggerError(err);
        break;
      default:
        this.emit('error', 'Unknown trigger state');
        break;
    }
  }

  _startStreaming() {
    if (!this.stream) {
      this.emit('error', 'No stream');
      return;
    }

    this.stream.on('end', err => this._triggerTerminalState('end', err));
    this.stream.on('error', err => this._triggerTerminalState('error', err));

    const data = this.streamingData;
    data.length = 20;
    data.missed = 0;

    this.stream.once('readable', () => this._send());
  }

  _setPaused(paused) {
    if (paused) {
      this.paused = true;
      this._setSpeaking(false);
    } else {
      this.paused = false;
      this._setSpeaking(true);
    }
  }

  /**
   * Stops the current stream permanently and emits an `end` event.
   */
  end() {
    this._triggerTerminalState('end', 'user requested');
  }

  /**
   * The volume of the stream, relative to the stream's input volume
   * @type {number}
   * @readonly
   */
  get volume() {
    return this._volume;
  }

  /**
   * Sets the volume relative to the input stream - i.e. 1 is normal, 0.5 is half, 2 is double.
   * @param {number} volume The volume that you want to set
   */
  setVolume(volume) {
    this._volume = volume;
  }

  /**
   * Set the volume in decibels
   * @param {number} db The decibels
   */
  setVolumeDecibels(db) {
    this._volume = Math.pow(10, db / 20);
  }

  /**
   * Set the volume so that a perceived value of 0.5 is half the perceived volume etc.
   * @param {number} value The value for the volume
   */
  setVolumeLogarithmic(value) {
    this._volume = Math.pow(value, 1.660964);
  }

  /**
   * Stops sending voice packets to the voice connection (stream may still progress however)
   */
  pause() {
    this._setPaused(true);
  }

  /**
   * Resumes sending voice packets to the voice connection (may be further on in the stream than when paused)
   */
  resume() {
    this._setPaused(false);
  }
}

module.exports = StreamDispatcher;
